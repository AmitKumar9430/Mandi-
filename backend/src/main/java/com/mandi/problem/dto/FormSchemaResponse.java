package com.mandi.problem.dto;

import com.mandi.problem.ProblemCategory;
import com.mandi.problem.RequestType;
import com.mandi.problem.ServiceType;
import com.mandi.user.Role;

import java.util.List;
import java.util.Map;

public class FormSchemaResponse {
    private Role role;
    private RequestType requestType;
    private ProblemCategory category;
    private ServiceType serviceType;
    private String formTitle;
    private String formTitleHi;
    private String formDescription;
    private String formDescriptionHi;
    private boolean isOffer;
    private List<FormFieldDefinition> fields;
    private Map<String, Object> defaultValues;

    public FormSchemaResponse() {}

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public RequestType getRequestType() { return requestType; }
    public void setRequestType(RequestType requestType) { this.requestType = requestType; }
    public ProblemCategory getCategory() { return category; }
    public void setCategory(ProblemCategory category) { this.category = category; }
    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
    public String getFormTitle() { return formTitle; }
    public void setFormTitle(String formTitle) { this.formTitle = formTitle; }
    public String getFormTitleHi() { return formTitleHi; }
    public void setFormTitleHi(String formTitleHi) { this.formTitleHi = formTitleHi; }
    public String getFormDescription() { return formDescription; }
    public void setFormDescription(String formDescription) { this.formDescription = formDescription; }
    public String getFormDescriptionHi() { return formDescriptionHi; }
    public void setFormDescriptionHi(String formDescriptionHi) { this.formDescriptionHi = formDescriptionHi; }
    public boolean isOffer() { return isOffer; }
    public void setOffer(boolean offer) { isOffer = offer; }
    public List<FormFieldDefinition> getFields() { return fields; }
    public void setFields(List<FormFieldDefinition> fields) { this.fields = fields; }
    public Map<String, Object> getDefaultValues() { return defaultValues; }
    public void setDefaultValues(Map<String, Object> defaultValues) { this.defaultValues = defaultValues; }
}
