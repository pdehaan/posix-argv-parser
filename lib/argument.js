var busterPromise = require("buster-promise");

module.exports = {
    addValidator: function (validator) {
        this.validators.push(validator);
    },

    get validators() {
        return this._validators || (this._validators = []);
    },

    validatorPromise: function () {
        var promise = busterPromise.create();

        var validatorPromises = [];
        for (var i = 0, ii = this.validators.length; i < ii; i++) {
            validatorPromises.push(this.makeValidator(this.validators[i].call(this)));
        }

        busterPromise.all(validatorPromises).then(function () {
            promise.resolve();
        }, function (errors) {
            promise.reject(errors);
        });


        return promise;
    },

    // Validators can return promises or strings. This makes a promise out of
    // those strings.
    makeValidator: function (promiseOrString) {
        if (typeof(promiseOrString) == "string") {
            return busterPromise.create().reject(promiseOrString);
        } else if (promiseOrString == undefined) {
            return busterPromise.create().resolve();
        } else {
            return promiseOrString;
        }
    },
};