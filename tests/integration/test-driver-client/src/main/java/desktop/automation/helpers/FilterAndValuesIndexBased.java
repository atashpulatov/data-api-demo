package desktop.automation.helpers;

public class FilterAndValuesIndexBased extends FilterAndValues {
    private int filter;
    private int[] values;

    public FilterAndValuesIndexBased(int filter, int[] values) {
        this.filter = filter;
        this.values = values;
    }

    public int getFilter() {
        return filter;
    }

    public void setFilter(int filter) {
        this.filter = filter;
    }

    public int[] getValues() {
        return values;
    }

    public void setValues(int[] values) {
        this.values = values;
    }
}
