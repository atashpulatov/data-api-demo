package desktop.automation.helpers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.driver.implementations.ImportObject;

import java.util.LinkedList;
import java.util.List;

public class ImportPrepareDataHelperArgumments {
    private ImportObject importObject;

    private Machine machine;
    private String cell;
    private int sheetIndex;
    private Boolean isFirstImport;
    private boolean isDataset;
    private boolean isMyLibrarySwitchOn;
    private String objectName;

    //for prepare data only
    private int[] attributesToChoose;
    private int[] metricsToChoose;
    private FilterAndValues[] filtersAndValuesToChoose;

    private boolean isEditFlow;
    private int importRefreshFlowTimeOut;

    public static final String DEFAULT_DATASET = "5k Sales Records.csv";
    public static final String DEFAULT_LARGE_DATASET = "100k Sales Records.csv";
    public static final String DEFAULT_REPORT = "1k report";
    public static final String DEFAULT_LARGE_REPORT = "report 100k rows";

    public ImportPrepareDataHelperArgumments(ImportObject importObject, Machine machine, String cell, int sheetIndex, Boolean isFirstImport, boolean isDataset, boolean isMyLibrarySwitchOn, String objectName, int[] attributesToChoose, int[] metricsToChoose, FilterAndValues[] filtersAndValuesToChoose, boolean isEditFlow, int importRefreshFlowTimeOut) {
        this.importObject = importObject;
        this.machine = machine;
        this.cell = cell;
        this.sheetIndex = sheetIndex;
        this.isFirstImport = isFirstImport;
        this.isDataset = isDataset;
        this.isMyLibrarySwitchOn = isMyLibrarySwitchOn;
        this.objectName = objectName;
        this.attributesToChoose = attributesToChoose;
        this.metricsToChoose = metricsToChoose;
        this.filtersAndValuesToChoose = filtersAndValuesToChoose;
        this.isEditFlow = isEditFlow;
        this.importRefreshFlowTimeOut = importRefreshFlowTimeOut;
    }

    public Machine getMachine() {
        return machine;
    }

    public String getCell() {
        return cell;
    }

    public int getSheetIndex() {
        return sheetIndex;
    }

    public Boolean getFirstImport() {
        return isFirstImport;
    }

    public boolean isDataset() {
        return isDataset;
    }

    public boolean isMyLibrarySwitchOn() {
        return isMyLibrarySwitchOn;
    }

    public String getObjectName() {
        return objectName;
    }

    public int[] getAttributesToChoose() {
        return attributesToChoose;
    }

    public int[] getMetricsToChoose() {
        return metricsToChoose;
    }

    public FilterAndValues[] getFiltersAndValuesToChoose() {
        return filtersAndValuesToChoose;
    }

    public FilterAndValuesIndexBased[] getFiltersAndValuesToChooseIndexBased(){
        FilterAndValues[] filtersAndValuesToChoose = getFiltersAndValuesToChoose();
        FilterAndValuesIndexBased[] res = new FilterAndValuesIndexBased[filtersAndValuesToChoose.length];

        for (int i = 0; i < filtersAndValuesToChoose.length; i++) {
            FilterAndValues filterAndValues = filtersAndValuesToChoose[i];
            res[i] = (FilterAndValuesIndexBased)filterAndValues;
        }

        return res;
    }

    public boolean isEditFlow() {
        return isEditFlow;
    }

    public int getImportRefreshFlowTimeOut() {
        return importRefreshFlowTimeOut;
    }

    public ImportObject getImportObject() {
        return importObject;
    }

    //should be temporary since locating the filters increases overhead a lot, all the filters are retrieved at once, but would be better to find a faster way to retrieve the filter elements
    //then this method would be effectively deprecated
    public int[] getIndexBasedFilterIndexes(){
        if (filtersAndValuesToChoose == null || filtersAndValuesToChoose.length == 0)
            return null;

        List<Integer> res = new LinkedList<>();
        for (int i = 0; i < filtersAndValuesToChoose.length; i++) {
            FilterAndValues filter = filtersAndValuesToChoose[i];

            if (filter instanceof FilterAndValuesIndexBased)
                res.add(((FilterAndValuesIndexBased)filter).getFilter());
        }

        return res.size() == 0 ? null : res.stream().mapToInt(i -> i).toArray();
    }

    public String[] getNameBasedFilterNames(){
        if (filtersAndValuesToChoose == null || filtersAndValuesToChoose.length == 0)
            return null;

        List<String> res = new LinkedList<>();
        for (int i = 0; i < filtersAndValuesToChoose.length; i++) {
            FilterAndValues filter = filtersAndValuesToChoose[i];

            if (filter instanceof FilterAndValuesNameBased)
                res.add(((FilterAndValuesNameBased)filter).getFilter());
        }

        return res.size() == 0 ? null : res.toArray(new String[0]);
    }

    public static class Builder {
        private ImportObject importObject = null;

        private Machine machine;
        private String cell = "A1";
        private int sheetIndex = 1;
        private Boolean isFirstImport = null;
        private boolean isDataset = false;
        private boolean isMyLibrarySwitchOn = false;
        private String objectName = DEFAULT_REPORT;

        private int[] attributesToChoose = null;
        private int[] metricsToChoose = null;
        private FilterAndValues[] filtersAndValuesToChoose = null;

        private boolean isEditFlow = false;
        private int importRefreshFlowTimeOut = 40;

        public Builder(Machine machine) {
            this.machine = machine;
        }

        public Builder(Machine machine, boolean isDataset) {
            this.machine = machine;
            this.isDataset = isDataset;

            if (isDataset)
                objectName = DEFAULT_DATASET;
        }

        public Builder withCell(String cell){
            this.cell = cell;

            return this;
        }

        public Builder withSheetIndex(int sheetIndex){
            this.sheetIndex = sheetIndex;

            return this;
        }

        public Builder isFirstImport(Boolean isFirstImport){
            this.isFirstImport = isFirstImport;

            return this;
        }

        public Builder isDataset(boolean isDataset){
            this.isDataset = isDataset;

            return this;
        }

        public Builder isMyLibrarySwitchOn(boolean isMyLibrarySwitchOn){
            this.isMyLibrarySwitchOn = isMyLibrarySwitchOn;

            return this;
        }

        public Builder withObjectName(String objectName){
            this.objectName = objectName;

            return this;
        }

        public Builder withAttributes(int[] attributes){
            this.attributesToChoose = attributes;

            return this;
        }

        public Builder withMetrics(int[] metrics){
            this.metricsToChoose = metrics;

            return this;
        }

        public Builder withFiltersAndValues(FilterAndValues[] filterAndValues){
            this.filtersAndValuesToChoose = filterAndValues;

            return this;
        }

        public Builder isEditFlow(boolean isEditFlow) {
            this.isEditFlow = isEditFlow;

            return this;
        }

        public Builder withImportRefreshFlowTimeOut(int importRefreshFlowTimeOut){
            this.importRefreshFlowTimeOut = importRefreshFlowTimeOut;

            return this;
        }

        public Builder withImportObject(ImportObject importObject) {
            this.importObject = importObject;
            //import object has it's own name and isDataset defined, should not be overwritten later with withObjectName and isDataset methods
            this.objectName = importObject.getName();
            this.isDataset = importObject.isDataset();

            return this;
        }

        public ImportPrepareDataHelperArgumments build(){
            return new ImportPrepareDataHelperArgumments(importObject, machine, cell, sheetIndex, isFirstImport, isDataset, isMyLibrarySwitchOn, objectName, attributesToChoose, metricsToChoose, filtersAndValuesToChoose, isEditFlow, importRefreshFlowTimeOut);
        }
    }
}
