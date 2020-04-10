package desktop.automation.helpers;

public class FilterAndValuesNameBased extends FilterAndValues {
    private String filter;
    private String[] values;

    public FilterAndValuesNameBased(String filter, String[] values) {
        this.filter = filter;
        this.values = values;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public String[] getValues() {
        return values;
    }

    public void setValues(String[] values) {
        this.values = values;
    }
}
