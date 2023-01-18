sap.ui.define([
    "./BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("fg.userupload.controller.UserUpload", {
            onInit: function () {
                let oFormElementsObj = {
                    ["Email"]: "",
                    ["Username"]: "",
                    ["First Name"]: "",
                    ["Last Name"]: "",
                    ["Person Country"]: "",
                    ["Person City"]: "",
                    ["ZIPPostal Code"]: "",
                    ["City"]: "",
                    ["Primary Business Unit"]: "",
                    ["Primary Supervisor Username"]: "",
                    ["Person State Province"]: "",
                    ["Person Address 1"]: "",
                    ["Person Address 2"]: "",
                    ["StateProvince"]: "",
                    ["Country"]: "USA",
                    ["Company Name"]: "",
                    ["Person Phone Number"]: "",
                    ["Address 1"]: "",
                    ["Person Postal Code"]: "",
                    ["Role Name"]: "",
                    ["Phone Number"]: "",
                    ["Title"]: "Mr",
                }
                let oFormModel = new JSONModel();
                oFormModel.setData({ "formData": oFormElementsObj });
                this.setModel(oFormModel, "UserDataModel");
            },

            _generateToken: function(){
                const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                const appPath = appId.replaceAll(".", "/");
                this.appModulePath = jQuery.sap.getModulePath(appPath);
                let that= this;
                let sApplicationKey = "CYPDSD2L2GqlRYeV3VfY6rCTlaP";
                let sAuthorizationEncodedString = btoa("D037@fg_help:D037_f8fNkCFW42k8AUp98GAS6MnraCr");
                let url = "https://partner1.fgvms.com";
                var settings = {
                    "url": "/api/oauth2/v2.0/token?grant_type=client_credentials&response_type=token",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "x-ApplicationKey": `${sApplicationKey}`,
                      "Authorization": `Basic ${sAuthorizationEncodedString}`,
                    //   "Authorization": "Basic RDAzN0BmZ19oZWxwOkQwMzdfZjhmTmtDRlc0Mms4QVVwOThHQVM2TW5yYUNy",
                    },
                  };
                  
                  $.ajax(settings).done(function (response) {
                    that.getModel("UserDataModel").setProperty("/accessToken", response.access_token);
                  }); 
            },
            onPressSaveUser: function (oEvent) {
                let oUserModelData = this.getView().getModel("UserDataModel").getProperty("/formData");
                let oDataModel = this.getOwnerComponent().getModel("UserUpload");
                oUserModelData["ZIP/Postal Code"] = oUserModelData["ZIPPostal Code"];
                oUserModelData["State/Province"] = oUserModelData["StateProvince"];
                delete oUserModelData["StateProvince"];
                delete oUserModelData["ZIPPostal Code"];
                const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                const appPath = appId.replaceAll(".", "/");
                const appModulePath = jQuery.sap.getModulePath(appPath);
                const sAccessToken = this.getModel("UserDataModel").getProperty("/accessToken");
                let payloadObject = {};
                payloadObject.data = [];
                payloadObject.data.push(oUserModelData);
                payloadObject.headers = {
                        "Type": "user_upload",
                        "Transaction": "True",
                        "Send Notification?": "True",
                        "Language": "en_US",
                        "Number Format": "#,##9.99 (Example: 1,234,567.99)",
                        "Date Format": "MM/DD/YYYY",
                        "Comments": "",
                        "Invited To FG": "True",
                        "Submit": "True",
                        "Buyer": "True"
                }
                let sUserCreationSuccessful = this.getResourceBundle().getText("UserUploadSuccessful");
                let sUserCreationNotSuccessful = this.getResourceBundle().getText("UserUploadNotSuccessful");
                this.getView().setBusy(true);
                let that = this;
                $.ajax({
                    url: `/api/vc/connector/user_upload`,
					// url: `${appModulePath}/DEST_SRV/sap/opu/odata/cis2se1/SERVICE_ORDER_SRV/ContractServices?$filter=PONumber eq '${sPONo}' and POItem eq '${sItemNo}'&$format=json`,
					method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-ApplicationKey": "CYPDSD2L2GqlRYeV3VfY6rCTlaP",
                        "Authorization": `Bearer ${sAccessToken}`,
                    },
                    data:JSON.stringify(payloadObject),
					async: false,
                    success: function (response) {
                        that.getView().setBusy(false);
                        MessageBox.success(sUserCreationSuccessful);

					},
                    error: function(){
                        that.getView().setBusy(false);
                        MessageBox.error(sUserCreationNotSuccessful);
                    },
				});

            },
            onChangeRadioButtonTitle: function (oEvent) {
                const oSelectedIndex = oEvent.getSource().getSelectedIndex();
                let oUserModelData = this.getModel("UserDataModel").getProperty("/formData");
                oUserModelData.Title = !oSelectedIndex ? "Mr" : "Mrs.";
            },

            onAfterRendering: function(){
                this._generateToken();
            },
        });
    });
