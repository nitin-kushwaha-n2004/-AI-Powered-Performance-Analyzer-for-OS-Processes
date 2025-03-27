interface Chart {
    destroy(): void;
    constructor(canvas: HTMLCanvasElement, config: ChartConfig): Chart;
}

interface ChartConfig {
    type: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            tension: number;
        }[];
    };
}

interface Process {
    id: number;
    name: string;
    cpu: number;
    memory: number;
    io: number;
}

interface Optimization {
    process: string;
    suggestion: string;
}

interface ForecastData {
    cpu: number[];
    memory: number[];
}

class ProcessAnalyzer {
    private monitoring: boolean;
    private processes: Process[];
    private chart: Chart | null;
    private updateInterval: number | null;
    private startBtn: HTMLElement | null;
    private stopBtn: HTMLElement | null;
    private processFile: HTMLInputElement | null;
    private processContainer: Element | null;
    private analysisContent: Element | null;
    private forecastCanvas: HTMLElement | null;
    private lastUpdateTime: number;

    constructor() {
        this.monitoring = false;
        this.processes = [];
        this.chart = null;
        this.updateInterval = null;
        this.startBtn = null;
        this.stopBtn = null;
        this.processFile = null;
        this.processContainer = null;
        this.analysisContent = null;
        this.forecastCanvas = null;
        this.lastUpdateTime = Date.now();
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        const fileInput = document.getElementById('processFile');
        if (fileInput instanceof HTMLInputElement) {
            this.processFile = fileInput;
        }
        this.processContainer = document.querySelector('.process-container');
        this.analysisContent = document.querySelector('.analysis-content');
        this.forecastCanvas = document.getElementById('forecastChart');
    }

    initEventListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startMonitoring());
        }
        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', () => this.stopMonitoring());
        }
        if (this.processFile) {
            this.processFile.addEventListener('change', (e: Event) => this.handleFileUpload(e));
        }
    }

    startMonitoring() {
        if (this.monitoring) return;
        this.monitoring = true;
        this.updateInterval = window.setInterval(() => this.updateDashboard(), 2000);
        this.simulateProcessData(); // Initial data
    }

    stopMonitoring() {
        this.monitoring = false;
        if (this.updateInterval) {
            window.clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const text = await file.text();
        try {
            this.processes = JSON.parse(text);
            this.analyzeProcesses();
        } catch (e) {
            console.error('Invalid file format:', e);
            if (this.analysisContent) {
                this.analysisContent.innerHTML = 'Error: Please upload a valid JSON file';
            }
        }
    }

    simulateProcessData(): Process[] {
        return Array.from({ length: 10 }, (_, i) => ({
            id: i,
            name: `Process_${i}`,
            cpu: Math.random() * 100,
            memory: Math.random() * 1000,
            io: Math.random() * 50
        }));
    }

    analyzeProcesses() {
        const bottlenecks = this.detectBottlenecks();
        const optimizations = this.generateOptimizations(bottlenecks);
        this.renderProcesses();
        this.renderAnalysis(bottlenecks, optimizations);
        this.renderForecast();
    }

    detectBottlenecks(): Process[] {
        return this.processes.filter(p => p.cpu > 80 || p.memory > 800 || p.io > 40);
    }

    generateOptimizations(bottlenecks: Process[]): Optimization[] {
        return bottlenecks.map((p: Process) => ({
            process: p.name,
            suggestion: this.getOptimizationSuggestion(p)
        }));
    }

    getOptimizationSuggestion(process: Process): string {
        if (process.cpu > 80) return 'Reduce CPU-intensive operations or increase thread priority';
        if (process.memory > 800) return 'Optimize memory usage or increase RAM allocation';
        if (process.io > 40) return 'Optimize I/O operations or implement caching';
        return 'Monitor process';
    }

    renderProcesses() {
        if (this.processContainer) {
            this.processContainer.innerHTML = this.processes.map(p => `
                <div class="process-item ${this.isBottleneck(p) ? 'bottleneck' : ''}">
                    ${p.name}: CPU ${p.cpu.toFixed(1)}% | Mem ${p.memory.toFixed(1)}MB | I/O ${p.io.toFixed(1)}
                </div>
            `).join('');
        }
    }

    isBottleneck(process: Process): boolean {
        return process.cpu > 80 || process.memory > 800 || process.io > 40;
    }

    renderAnalysis(bottlenecks: Process[], optimizations: Optimization[]) {
        if (this.analysisContent) {
            this.analysisContent.innerHTML = `
                <p>Bottlenecks Detected: ${bottlenecks.length}</p>
                ${optimizations.map(o => `
                    <div class="optimization">
                        <strong>${o.process}:</strong> ${o.suggestion}
                    </div>
                `).join('')}
            `;
        }
    }

    renderForecast() {
        if (this.chart) {
            this.chart.destroy();
        }

        if (this.forecastCanvas instanceof HTMLCanvasElement) {
            const forecastData = this.generateForecastData();
            this.chart = new (window as any).Chart(this.forecastCanvas, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 10 }, (_, i) => `T+${i}`),
                    datasets: [{
                        label: 'CPU Usage Forecast',
                        data: forecastData.cpu,
                        borderColor: '#00ffcc',
                        tension: 0.1
                    }, {
                        label: 'Memory Usage Forecast',
                        data: forecastData.memory,
                        borderColor: '#ff0066',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    private generateForecastData(): ForecastData {
        const currentTime = Date.now();
        const timeDiff = (currentTime - this.lastUpdateTime) / 1000; // seconds
        this.lastUpdateTime = currentTime;

        // Generate forecast based on current process data and time difference
        return {
            cpu: Array.from({ length: 10 }, (_, i) => {
                const baseValue = this.processes.reduce((sum, p) => sum + p.cpu, 0) / this.processes.length;
                return Math.min(100, Math.max(0, baseValue + (Math.random() - 0.5) * 20));
            }),
            memory: Array.from({ length: 10 }, (_, i) => {
                const baseValue = this.processes.reduce((sum, p) => sum + p.memory, 0) / this.processes.length;
                return Math.max(0, baseValue + (Math.random() - 0.5) * 200);
            })
        };
    }

    private updateDashboard(): void {
        this.processes = this.simulateProcessData();
        this.analyzeProcesses();
    }
}

const analyzer = new ProcessAnalyzer();
