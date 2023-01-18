/*
@copyright@
*/
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
	],
	function (
		Controller,
		MessageBox,
	) {
		return Controller.extend("fg.userupload.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */

			setBusy: function (bFlag) {
				this.getModel("appView").setProperty("/busy", bFlag);
			},

			getResourceBundle: function () {
				return this.getOwnerComponent()
					.getModel("i18n")
					.getResourceBundle();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel: function (sName) {
				if (sName) {
					return this.getView().getModel(sName);
				}

				return this.getView().getModel();
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel: function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for showing dialog fragment.
			 * @public
			 * @param {object} oConfig configuration for showing dialog
			 * @param {boolean} bHidden if dialog should be hidden
			 */
			showFragmentDialog: function (oConfig, bHidden) {
				if (!this[oConfig.sVariable]) {
					this[oConfig.sVariable] = sap.ui.xmlfragment(
						this.getView().getId(),
						"fg.userupload.fragment.dialog." + oConfig.sFragmentName,
						this
					);
					//define models
					this.getView().addDependent(this[oConfig.sVariable]);
					if (oConfig.fnInit) {
						oConfig.fnInit();
					}
				}
				const oDialog = this[oConfig.sVariable];

				if (oConfig.fnBeforeOpen) {
					oConfig.fnBeforeOpen(oDialog);
				}

				if (oConfig.fnOpen) {
					oConfig.fnOpen(oDialog);
				} else if (!bHidden) {
					oDialog.open();
				}

				if (oConfig.fnAfterOpen) {
					oConfig.fnAfterOpen(oDialog);
				}
			},
			onCloseDialog: function (oEvent, sVariable) {
				this[sVariable].close();
			},

			
		});
	}
);