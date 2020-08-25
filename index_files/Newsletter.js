var Newsletter = angular.module('AccionaCorp', []).controller('SuscriptionController',
    function ($scope, $http) {

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: false
        };

        $scope.RemoveSuscriptionModel = {
            isDownload: false
        };
        $scope.AddLegalAceptation = false;
        $scope.RemoveLegalAceptation = false;
        $scope.AddSuscriptionSent = false;
        $scope.AddMailChimpResponseError = false;
        $scope.RemoveMailChimpResponseError = false;
        $scope.RemoveSuscriptionSent = false;

        $scope.AddSuscription = function () {


            if ($scope.AddSuscriptionForm.$valid) {
                $scope.RemoveSuscriptionSent = false;
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/Subscribe',
                        data: $scope.AddSuscriptionModel
                    }).then(function (result) {

                        if (result.data.Data === 'Actualizado') {
                            $scope.AddSuscriptionSent = true;
                            $scope.AddMailChimpResponseError = false;

                            openFancyboxConfirmation();

                        } else if (result.data.Data === 'Error') {
                            $scope.AddSuscriptionSent = false;
                            $scope.AddMailChimpResponseError = true;
                            openFancyboxError();
                        } else {
                            $scope.AddSuscriptionSent = true;

                            openFancyboxConfirmation();
                        }

                        //console.log("result.data: \n");
                        //console.log(result.data.Data);

                    }).catch(
                    console.error
                    );
            }
        };

        $scope.RemoveSuscription = function () {

            if ($scope.RemoveSuscriptionForm.$valid) {
                $scope.AddSuscriptionSent = false;
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/UnSubscribe',
                        data: $scope.RemoveSuscriptionModel
                    }).then(function (result) {

                        closeModalUnsubscribe();
                        $scope.RemoveSuscriptionSent = true;

                    }).catch(function (error) {
                        console.log(error);
                        $scope.RemoveSuscriptionSent = false;
                        $scope.RemoveMailChimpResponseError = true;
                    });
            }
        };
    });

Newsletter.controller('SuscriptionOldController',
    function ($scope, $http) {

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: false
        };

        $scope.RemoveSuscriptionModel = {
            isDownload: false
        };
        $scope.AddLegalAceptation = false;
        $scope.RemoveLegalAceptation = false;
        $scope.AddSuscriptionSent = false;
        $scope.AddMailChimpResponseError = false;
        $scope.RemoveMailChimpResponseError = false;
        $scope.RemoveSuscriptionSent = false;

        $scope.AddSuscription = function () {


            if ($scope.AddSuscriptionForm.$valid) {
                $scope.RemoveSuscriptionSent = false;
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/Subscribe',
                        data: $scope.AddSuscriptionModel
                    }).then(function (result) {

                        if (result.data.Data == 'Actualizado') {
                            $scope.AddSuscriptionSent = true;
                            $scope.AddMailChimpResponseError = false;
                        } else if (result.data.Data == 'Error') {
                            $scope.AddSuscriptionSent = false;
                            $scope.AddMailChimpResponseError = true;
                        } else {
                            $scope.AddSuscriptionSent = true;
                        }

                        console.log("result.data: \n");
                        console.log(result.data.Data);

                    }).catch(
                    console.error
                    );
            }
        };

        $scope.RemoveSuscription = function () {

            if ($scope.RemoveSuscriptionForm.$valid) {
                $scope.AddSuscriptionSent = false;
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/UnSubscribe',
                        data: $scope.RemoveSuscriptionModel
                    }).then(function (result) {

                        $scope.RemoveSuscriptionSent = true;
                        openFancyboxConfirmationUnsubs();

                    }).catch(function (error) {
                        console.log(error);
                        $scope.RemoveSuscriptionSent = false;
                        $scope.RemoveMailChimpResponseError = true;

                    });
            }
        };
    });

Newsletter.controller('SuscriptionAfterNoteController',
    function ($scope, $http) {

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: false
        };

        $scope.AddLegalAceptation = false;
        $scope.AddSuscriptionSent = false;
        $scope.AddMailChimpResponseError = false;

        $scope.AddSuscription = function () {


            if ($scope.AddSuscriptionForm.$valid) {
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/Subscribe',
                        data: $scope.AddSuscriptionModel
                    }).then(function (result) {

                        if (result.data.Data == 'Actualizado') {
                            $scope.AddSuscriptionSent = true;
                            $scope.AddMailChimpResponseError = false;
                            var origin = "note";
                            openFancyboxConfirmation(origin);
                        } else if (result.data.Data == 'Error') {
                            $scope.AddSuscriptionSent = false;
                            $scope.AddMailChimpResponseError = true;
                            openFancyboxError();
                        } else {
                            $scope.AddSuscriptionSent = true;
                            origin = "note";
                            openFancyboxConfirmation(origin);
                        }

                        console.log("result.data: \n");
                        console.log(result.data.Data);

                    }).catch(
                    console.error
                    );
            }
        };
    });

Newsletter.controller('SuscriptionPressRoomAsideController',
    function ($scope, $http) {

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: false
        };

        $scope.AddLegalAceptation = false;
        $scope.AddSuscriptionSent = false;
        $scope.AddMailChimpResponseError = false;

        $scope.AddSuscription = function () {


            if ($scope.AddSuscriptionForm.$valid) {
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/Subscribe',
                        data: $scope.AddSuscriptionModel
                    }).then(function (result) {

                        if (result.data.Data == 'Actualizado') {
                            $scope.AddSuscriptionSent = true;
                            $scope.AddMailChimpResponseError = false;
                            var origin = "pressroom";
                            openFancyboxConfirmation(origin);
                        } else if (result.data.Data == 'Error') {
                            $scope.AddSuscriptionSent = false;
                            $scope.AddMailChimpResponseError = true;
                            openFancyboxError();
                        } else {
                            $scope.AddSuscriptionSent = true;
                            origin = "pressroom";
                            openFancyboxExistentUser(origin);
                        }


                    }).catch(
                    console.error
                    );
            }
        };
    });

Newsletter.controller('SuscriptionDownloadContentController',
    function ($scope, $http) {

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: true
        };

        $scope.AddLegalAceptation = false;
        $scope.AddSuscriptionSent = false;
        $scope.AddMailChimpResponseError = false;

        $scope.AddSuscription = function () {


            if ($scope.AddSuscriptionForm.$valid) {
                $http(
                    {
                        method: 'POST',
                        url: '/umbraco/Api/MailChimp/Subscribe',
                        data: $scope.AddSuscriptionModel
                    }).then(function (result) {

                        if (result.data.Data == 'Actualizado') {
                            $scope.AddSuscriptionSent = true;
                            $scope.AddMailChimpResponseError = false;
                            var origin = "ebook";
                            openFancyboxConfirmation(origin);
                        } else if (result.data.Data == 'Error') {
                            $scope.AddSuscriptionSent = false;
                            $scope.AddMailChimpResponseError = true;
                            openFancyboxError();
                        } else {
                            $scope.AddSuscriptionSent = true;
                            origin = "ebook";
                            openFancyboxConfirmation(origin);
                        }

                    }).catch(
                    console.error
                    );
            }
        };
    });


Newsletter.controller('FooterSuscriptionController',
    function ($scope, $http) {

        $scope.FooterAddSuscriptionSent = false;
        $scope.FooterAddMailChimpResponseError = false;
        $scope.FooterAddLegalAceptation = false;

        $scope.AddSuscriptionModel = {
            email_address: "",
            language: "" + lang,
            isDownload: false
        };


        $scope.AddSuscriptionFooter = function () {
            
            if ($scope.FooterAddSuscriptionForm.$valid ) {

                $http({
                    method: 'POST',
                    url: '/umbraco/Api/MailChimp/Subscribe',
                    data: $scope.AddSuscriptionModel
                }).then(function (result) {
                    $("#MailchimpFooter input[id='email_address']").val('');
                    $scope.AddSuscriptionModel.email_address = "";
                    $scope.FooterAddSuscriptionForm.$setPristine();
                    $scope.FooterAddSuscriptionForm.$setUntouched();

                    if (result.data.Data == 'Actualizado') {
                        $scope.FooterAddSuscriptionSent = true;
                        var origin = "footer";
                        openFancyboxConfirmation(origin);
                    }
                    else if (result.data.Data == 'Error') {
                        $scope.FooterAddSuscriptionSent = false;
                        $scope.FooterAddMailChimpResponseError = true;
                        //openFancyboxError();
                    }
                    else if (result.data.Data == 'Existente') {
                        $scope.FooterAddSuscriptionSent = false;
                        openFancyboxExistentUser();
                    }
                    else {
                        $scope.FooterAddSuscriptionSent = false;
                        var origin = "footer";
                        openFancyboxConfirmation(origin);
                    }

                }).catch(
                    console.error
                    );
            }
        };
    });