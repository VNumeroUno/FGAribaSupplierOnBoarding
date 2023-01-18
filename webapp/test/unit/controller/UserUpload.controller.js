/*global QUnit*/

sap.ui.define([
	"fg/userupload/controller/UserUpload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("UserUpload Controller");

	QUnit.test("I should test the UserUpload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
