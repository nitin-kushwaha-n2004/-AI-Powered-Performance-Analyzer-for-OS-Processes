var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ProcessAnalyzer = /** @class */ (function () {
    function ProcessAnalyzer() {
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
    ProcessAnalyzer.prototype.initElements = function () {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        var fileInput = document.getElementById('processFile');
        if (fileInput instanceof HTMLInputElement) {
            this.processFile = fileInput;
        }
        this.processContainer = document.querySelector('.process-container');
        this.analysisContent = document.querySelector('.analysis-content');
        this.forecastCanvas = document.getElementById('forecastChart');
    };
    ProcessAnalyzer.prototype.initEventListeners = function () {
        var _this = this;
        if (this.startBtn) {
            this.startBtn.addEventListener('click', function () { return _this.startMonitoring(); });
        }
        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', function () { return _this.stopMonitoring(); });
        }
        if (this.processFile) {
            this.processFile.addEventListener('change', function (e) { return _this.handleFileUpload(e); });
        }
    };
    ProcessAnalyzer.prototype.startMonitoring = function () {
        var _this = this;
        if (this.monitoring)
            return;
        this.monitoring = true;
        this.updateInterval = window.setInterval(function () { return _this.updateDashboard(); }, 1000);
        this.simulateProcessData(); // Initial data
    };
    ProcessAnalyzer.prototype.stopMonitoring = function () {
        this.monitoring = false;
        if (this.updateInterval) {
            window.clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    };
    ProcessAnalyzer.prototype.handleFileUpload = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var target, file, text;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        target = event.target;
                        file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file)
                            return [2 /*return*/];
                        return [4 /*yield*/, file.text()];
                    case 1:
                        text = _b.sent();
                        try {
                            this.processes = JSON.parse(text);
                            this.analyzeProcesses();
                        }
                        catch (e) {
                            console.error('Invalid file format:', e);
                            if (this.analysisContent) {
                                this.analysisContent.innerHTML = 'Error: Please upload a valid JSON file';
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessAnalyzer.prototype.simulateProcessData = function () {
        return Array.from({ length: 10 }, function (_, i) { return ({
            id: i,
            name: "Process_".concat(i),
            cpu: Math.random() * 100,
            memory: Math.random() * 1000,
            io: Math.random() * 50
        }); });
    };
    ProcessAnalyzer.prototype.analyzeProcesses = function () {
        var bottlenecks = this.detectBottlenecks();
        var optimizations = this.generateOptimizations(bottlenecks);
        this.renderProcesses();
        this.renderAnalysis(bottlenecks, optimizations);
        this.renderForecast();
    };
    ProcessAnalyzer.prototype.detectBottlenecks = function () {
        return this.processes.filter(function (p) { return p.cpu > 80 || p.memory > 800 || p.io > 40; });
    };
    ProcessAnalyzer.prototype.generateOptimizations = function (bottlenecks) {
        var _this = this;
        return bottlenecks.map(function (p) { return ({
            process: p.name,
            suggestion: _this.getOptimizationSuggestion(p)
        }); });
    };
    ProcessAnalyzer.prototype.getOptimizationSuggestion = function (process) {
        if (process.cpu > 80)
            return 'Reduce CPU-intensive operations or increase thread priority';
        if (process.memory > 800)
            return 'Optimize memory usage or increase RAM allocation';
        if (process.io > 40)
            return 'Optimize I/O operations or implement caching';
        return 'Monitor process';
    };
    ProcessAnalyzer.prototype.renderProcesses = function () {
        var _this = this;
        if (this.processContainer) {
            this.processContainer.innerHTML = this.processes.map(function (p) { return "\n                <div class=\"process-item ".concat(_this.isBottleneck(p) ? 'bottleneck' : '', "\">\n                    ").concat(p.name, ": CPU ").concat(p.cpu.toFixed(1), "% | Mem ").concat(p.memory.toFixed(1), "MB | I/O ").concat(p.io.toFixed(1), "\n                </div>\n            "); }).join('');
        }
    };
    ProcessAnalyzer.prototype.isBottleneck = function (process) {
        return process.cpu > 80 || process.memory > 800 || process.io > 40;
    };
    ProcessAnalyzer.prototype.renderAnalysis = function (bottlenecks, optimizations) {
        if (this.analysisContent) {
            this.analysisContent.innerHTML = "\n                <p>Bottlenecks Detected: ".concat(bottlenecks.length, "</p>\n                ").concat(optimizations.map(function (o) { return "\n                    <div class=\"optimization\">\n                        <strong>".concat(o.process, ":</strong> ").concat(o.suggestion, "\n                    </div>\n                "); }).join(''), "\n            ");
        }
    };
    ProcessAnalyzer.prototype.renderForecast = function () {
        if (this.chart) {
            this.chart.destroy();
        }
        if (this.forecastCanvas instanceof HTMLCanvasElement) {
            var forecastData = this.generateForecastData();
            this.chart = new window.Chart(this.forecastCanvas, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 10 }, function (_, i) { return "T+".concat(i); }),
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
    };
    ProcessAnalyzer.prototype.generateForecastData = function () {
        var _this = this;
        var currentTime = Date.now();
        var timeDiff = (currentTime - this.lastUpdateTime) / 1000; // seconds
        this.lastUpdateTime = currentTime;
        // Generate forecast based on current process data and time difference
        return {
            cpu: Array.from({ length: 10 }, function (_, i) {
                var baseValue = _this.processes.reduce(function (sum, p) { return sum + p.cpu; }, 0) / _this.processes.length;
                return Math.min(100, Math.max(0, baseValue + (Math.random() - 0.5) * 20));
            }),
            memory: Array.from({ length: 10 }, function (_, i) {
                var baseValue = _this.processes.reduce(function (sum, p) { return sum + p.memory; }, 0) / _this.processes.length;
                return Math.max(0, baseValue + (Math.random() - 0.5) * 200);
            })
        };
    };
    ProcessAnalyzer.prototype.updateDashboard = function () {
        this.processes = this.simulateProcessData();
        this.analyzeProcesses();
    };
    return ProcessAnalyzer;
}());
var analyzer = new ProcessAnalyzer();
