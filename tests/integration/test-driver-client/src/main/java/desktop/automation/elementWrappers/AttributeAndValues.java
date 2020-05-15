package desktop.automation.elementWrappers;

public class AttributeAndValues {
    private String attribute;
    private String[] values;
    private int valueCount;

    public AttributeAndValues(String attribute, String[] values, int valueCount) {
        this.attribute = attribute;
        this.values = values;
        this.valueCount = valueCount;
    }

    public String getAttribute() {
        return attribute;
    }

    public String[] getValues() {
        return values;
    }

    public int getValueCount() {
        return valueCount;
    }
}
