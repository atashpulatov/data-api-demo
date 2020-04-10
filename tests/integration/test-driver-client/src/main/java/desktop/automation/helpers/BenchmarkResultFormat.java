package desktop.automation.helpers;

public class BenchmarkResultFormat {
    String ServerVersion;
    String PluginVersion;
    String ClientOS;
    int ClientCPUCores;
    String Browser;
    int Rows;
    int Columns;
    double ImportingTime;
    int NumberOfExecutions;
    double E2EDurationTime;
    int NumberOfClicks;
    //TODO for now at the end of the run, add the required symbols manually to JSON file. Later use string manipulation on final JSON to match %CPU-Usage and Memory-Usage
    double CPU_Usage;
    double Memory_Usage;

    public BenchmarkResultFormat(String serverVersion, String pluginVersion, String clientOS, int clientCPUCores, String browser, int rows, int columns, double importingTime, int numberOfExecutions, double e2EDurationTime, int numberOfClicks, double CPU_Usage, double memory_Usage) {
        ServerVersion = serverVersion;
        PluginVersion = pluginVersion;
        ClientOS = clientOS;
        ClientCPUCores = clientCPUCores;
        Browser = browser;
        Rows = rows;
        Columns = columns;
        ImportingTime = importingTime;
        NumberOfExecutions = numberOfExecutions;
        E2EDurationTime = e2EDurationTime;
        NumberOfClicks = numberOfClicks;
        this.CPU_Usage = CPU_Usage;
        Memory_Usage = memory_Usage;
    }

    public BenchmarkResultFormat() {
    }

    public String getServerVersion() {
        return ServerVersion;
    }

    public void setServerVersion(String serverVersion) {
        ServerVersion = serverVersion;
    }

    public String getPluginVersion() {
        return PluginVersion;
    }

    public void setPluginVersion(String pluginVersion) {
        PluginVersion = pluginVersion;
    }

    public String getClientOS() {
        return ClientOS;
    }

    public void setClientOS(String clientOS) {
        ClientOS = clientOS;
    }

    public int getClientCPUCores() {
        return ClientCPUCores;
    }

    public void setClientCPUCores(int clientCPUCores) {
        ClientCPUCores = clientCPUCores;
    }

    public String getBrowser() {
        return Browser;
    }

    public void setBrowser(String browser) {
        Browser = browser;
    }

    public int getRows() {
        return Rows;
    }

    public void setRows(int rows) {
        Rows = rows;
    }

    public int getColumns() {
        return Columns;
    }

    public void setColumns(int columns) {
        Columns = columns;
    }

    public double getImportingTime() {
        return ImportingTime;
    }

    public void setImportingTime(double importingTime) {
        ImportingTime = importingTime;
    }

    public int getNumberOfExecutions() {
        return NumberOfExecutions;
    }

    public void setNumberOfExecutions(int numberOfExecutions) {
        NumberOfExecutions = numberOfExecutions;
    }

    public double getE2EDurationTime() {
        return E2EDurationTime;
    }

    public void setE2EDurationTime(double e2EDurationTime) {
        E2EDurationTime = e2EDurationTime;
    }

    public int getNumberOfClicks() {
        return NumberOfClicks;
    }

    public void setNumberOfClicks(int numberOfClicks) {
        NumberOfClicks = numberOfClicks;
    }

    public double getCPU_Usage() {
        return CPU_Usage;
    }

    public void setCPU_Usage(double CPU_Usage) {
        this.CPU_Usage = CPU_Usage;
    }

    public double getMemory_Usage() {
        return Memory_Usage;
    }

    public void setMemory_Usage(double memory_Usage) {
        Memory_Usage = memory_Usage;
    }
}
