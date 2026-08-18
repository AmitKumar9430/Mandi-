package com.mandi.problem.dto;

import java.util.List;
import java.util.Map;

public class FormFieldDefinition {
    private String fieldName;
    private String label;
    private String labelHi;
    private String type; // "text", "number", "select", "date", "time", "boolean", "textarea", "file", "location"
    private boolean required;
    private String placeholder;
    private String helpText;
    private List<Map<String, String>> options;
    private Integer step = 3;
    private Integer order = 1;
    private Map<String, Object> validation;

    public FormFieldDefinition() {}

    public FormFieldDefinition(String fieldName, String label, String labelHi, String type, boolean required, String placeholder, String helpText, List<Map<String, String>> options, Integer step, Integer order) {
        this.fieldName = fieldName;
        this.label = label;
        this.labelHi = labelHi;
        this.type = type;
        this.required = required;
        this.placeholder = placeholder;
        this.helpText = helpText;
        this.options = options;
        this.step = step;
        this.order = order;
    }

    public static FormFieldDefinition of(String fieldName, String label, String labelHi, String type, boolean required, String placeholder, String helpText, List<Map<String, String>> options, Integer step, Integer order) {
        return new FormFieldDefinition(fieldName, label, labelHi, type, required, placeholder, helpText, options, step, order);
    }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getLabelHi() { return labelHi; }
    public void setLabelHi(String labelHi) { this.labelHi = labelHi; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
    public String getPlaceholder() { return placeholder; }
    public void setPlaceholder(String placeholder) { this.placeholder = placeholder; }
    public String getHelpText() { return helpText; }
    public void setHelpText(String helpText) { this.helpText = helpText; }
    public List<Map<String, String>> getOptions() { return options; }
    public void setOptions(List<Map<String, String>> options) { this.options = options; }
    public Integer getStep() { return step; }
    public void setStep(Integer step) { this.step = step; }
    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
    public Map<String, Object> getValidation() { return validation; }
    public void setValidation(Map<String, Object> validation) { this.validation = validation; }
}
