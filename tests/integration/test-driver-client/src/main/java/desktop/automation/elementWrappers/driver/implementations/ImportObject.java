package desktop.automation.elementWrappers.driver.implementations;

import desktop.automation.elementWrappers.AttributeAndValues;

public class ImportObject {
    private String name;
    private boolean isDataset;

    private AttributeAndValues[] attributeAndValues;
    private int attributeCount;
    private String[] metrics;
    private int metricCount;

    public static final ImportObject ONE_K_REPORT_VERSION_ONE;
    public static final ImportObject ONE_K_REPORT_VERSION_TWO;
    public static final ImportObject FIVE_K_SALES_RECORDS_VERSION_ONE;
    public static final ImportObject FIVE_K_SALES_RECORDS_VERSION_TWO;

    static {
        //ONE_K_REPORT_VERSION_ONE
        String name1 = "1k report";

        AttributeAndValues[] attributeAndValues1 = {
                new AttributeAndValues("Country", new String[]{"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda"}, 185),
                new AttributeAndValues("Item Type", new String[]{"Baby Food", "Beverages", "Cereal", "Clothes", "Cosmetics", "Fruits"}, 12),
                new AttributeAndValues("Order Type", null, -1),
                new AttributeAndValues("Order ID", null, -1),
                new AttributeAndValues("Order Priority", null, -1)
        };
        int attributeCount1 = 8;
        String[] metrics1 = {"Total Cost", "Total Profit", "Total Revenue", "Unit Cost", "Unit Price", "Units Sold"};
        int metricCount1 = 6;

        ONE_K_REPORT_VERSION_ONE = new ImportObject(name1, false, attributeAndValues1, attributeCount1, metrics1, metricCount1);

        //FIVE_K_SALES_RECORDS_VERSION_ONE
        String name2 = "5k Sales Records.csv";

        AttributeAndValues[] attributeAndValues2 = {
                new AttributeAndValues("Region", new String[]{"Asia", "Australia and Oceania", "Central America and the Caribbean", "Europe"}, 7),
                new AttributeAndValues("Country", new String[]{"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda"}, 185),
                new AttributeAndValues("Item Type", null, -1),
                new AttributeAndValues("Sales Channel", null, -1)
        };
        int attributeCount2 = 8;
        String[] metrics2 = {"Units Sold", "Unit Price", "Unit Cost", "Total Revenue", "Total Cost", "Total Profit", "Row Count - 5k Sales Records.csv"};
        int metricCount2 = 7;

        FIVE_K_SALES_RECORDS_VERSION_ONE = new ImportObject(name2, true, attributeAndValues2, attributeCount2, metrics2, metricCount2);

        //ONE_K_REPORT_VERSION_TWO
        String name3 = "1k report";

        AttributeAndValues[] attributeAndValues3 = {
                new AttributeAndValues("Country", new String[]{"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda"}, 185),
                new AttributeAndValues("Item Type", new String[]{"Baby Food", "Beverages", "Cereal", "Clothes", "Cosmetics", "Fruits"}, 12),
                new AttributeAndValues("Order Date", null, -1),
                new AttributeAndValues("Order ID", null, -1),
                new AttributeAndValues("Order Priority", null, -1)
        };
        int attributeCount3 = 7;
        String[] metrics3 = {"Total Cost", "Total Profit"};
        int metricCount3 = 2;

        ONE_K_REPORT_VERSION_TWO = new ImportObject(name3, false, attributeAndValues3, attributeCount3, metrics3, metricCount3);

        //FIVE_K_SALES_RECORDS_VERSION_TWO
        String name4 = "5k Sales Records.csv";

        AttributeAndValues[] attributeAndValues4 = {
                new AttributeAndValues("Region", new String[]{"Asia", "Australia and Oceania", "Central America and the Caribbean", "Europe"}, 7),
                new AttributeAndValues("Country", new String[]{"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda"}, 185),
                new AttributeAndValues("Item Type", null, -1),
                new AttributeAndValues("Sales Channel", null, -1)
        };
        int attributeCount4 = 8;
        String[] metrics4 = {"Units Sold", "Unit Price", "Unit Cost", "Total Revenue", "Total Cost", "Total Profit", "Row Count - 5k Sales Records.csv"};
        int metricCount4 = 7;

        FIVE_K_SALES_RECORDS_VERSION_TWO = new ImportObject(name4, true, attributeAndValues4, attributeCount4, metrics4, metricCount4);
    }

    public ImportObject(String name, boolean isDataset, AttributeAndValues[] attributeAndValues, int attributeCount, String[] metrics, int metricCount) {
        this.name = name;
        this.isDataset = isDataset;
        this.attributeAndValues = attributeAndValues;
        this.attributeCount = attributeCount;
        this.metrics = metrics;
        this.metricCount = metricCount;
    }

    public boolean isDataset() {
        return isDataset;
    }

    public String getName() {
        return name;
    }

    public AttributeAndValues[] getAttributeAndValues() {
        return attributeAndValues;
    }

    public int getAttributeCount() {
        return attributeCount;
    }

    public String[] getMetrics() {
        return metrics;
    }

    public int getMetricCount() {
        return metricCount;
    }
}
