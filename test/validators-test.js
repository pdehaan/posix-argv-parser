var buster = require("buster");
var busterArgs = require("./../lib/buster-args");

buster.testCase("buster-args built in validators", {
    setUp: function () {
        this.a = Object.create(busterArgs);
    },

    "test basic validator with error": function (done) {
        var actualError = "An error message";

        var opt = this.a.createOption("-p");
        opt.addValidator(function () {
            return buster.promise.create().reject(actualError);
        });

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert.equals(errors.length, 1);
            buster.assert.equals(errors[0], actualError);
            done();
        });
    },

    "test basic validator without error": function (done) {
        var opt = this.a.createOption("-p");
        opt.addValidator(function () {
            return buster.promise.create().resolve();
        });

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert.isUndefined(errors);
            done();
        });
    },

    "test adding validator that uses the value of the option": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;
        opt.addValidator(function () {
            return buster.promise.create().reject(this.value() + " is crazy.");
        });

        this.a.handle([null, null, "-p1234"], function (errors) {
            buster.assert.equals(errors.length, 1);
            buster.assert.equals(errors[0], "1234 is crazy.");
            done();
        });
    },

    "test option validator returning a string instead of a promise": function (done) {
        var opt = this.a.createOption("-p");
        opt.addValidator(function () {
            return "This is an error message.";
        });

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert.equals(errors.length, 1);
            buster.assert.equals(errors[0], "This is an error message.");
            done();
        });
    },

    "test operand validator returning a string instead of a promise": function (done) {
        var opt = this.a.createOperand();
        opt.addValidator(function () {
            return "This is an error message.";
        });

        this.a.handle([null, null], function (errors) {
            buster.assert.equals(errors.length, 1);
            buster.assert.equals(errors[0], "This is an error message.");
            done();
        });
    },

    "test validator returning nothing is considered valid": function (done) {
        var opt = this.a.createOption("-p");
        opt.addValidator(function () {});

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert.isUndefined(errors);
            buster.assert(opt.isSet);
            done();
        });
    },

    "integer": {
        setUp: function () {
            this.opt = this.a.createOption("-p");
            this.opt.addValidator(busterArgs.validators.integer());
            this.opt.hasValue = true;
        },

        "test passing integer": function (done) {
            var self = this;
            this.a.handle([null, null, "-p123"], function (errors) {
                buster.assert.isUndefined(errors);
                buster.assert.same(self.opt.value(), 123);
                done();
            });
        },

        "test passing string": function (done) {
            this.a.handle([null, null, "-pabc"], function (errors) {
                buster.assert.equals(errors.length, 1);
                buster.assert.match(errors[0], "abc");
                buster.assert.match(errors[0], /not an integer/);
                done();
            });
        },

        "test passing comma float": function (done) {
            this.a.handle([null, null, "-p123,4"], function (errors) {
                buster.assert.equals(errors.length, 1);
                buster.assert.match(errors[0], "123,4");
                buster.assert.match(errors[0], /not an integer/);
                done();
            });
        },

        "test passing dot float": function (done) {
            this.a.handle([null, null, "-p123.4"], function (errors) {
                buster.assert.equals(errors.length, 1);
                buster.assert.match(errors[0], "123.4");
                buster.assert.match(errors[0], /not an integer/);
                done();
            });
        }
    },

    "number": {
        setUp: function () {
            this.opt = this.a.createOption("-p");
            this.opt.addValidator(busterArgs.validators.number());
            this.opt.hasValue = true;
        },

        "test passing integer": function (done) {
            var self = this;
            this.a.handle([null, null, "-p123"], function (errors) {
                buster.assert.isUndefined(errors);
                buster.assert.same(self.opt.value(), 123);
                done();
            });
        },

        "test passing string": function (done) {
            this.a.handle([null, null, "-pabc"], function (errors) {
                buster.assert.equals(errors.length, 1);
                buster.assert.match(errors[0], "abc");
                buster.assert.match(errors[0], /not a number/);
                done();
            });
        },

        "test passing comma float": function (done) {
            this.a.handle([null, null, "-p123,4"], function (errors) {
                buster.assert.equals(errors.length, 1);
                buster.assert.match(errors[0], "123,4");
                buster.assert.match(errors[0], /not a number/);
                done();
            });
        },

        "test passing dot float": function (done) {
            var self = this;
            this.a.handle([null, null, "-p123.4"], function (errors) {
                buster.assert.isUndefined(errors);
                buster.assert.same(self.opt.value(), 123.4);
                done();
            });
        }
    },

    "required": {
        setUp: function () {
            this.opt = this.a.createOption("-p");
            this.opt.addValidator(busterArgs.validators.required());
        },

        "for option with value": {
            setUp: function () {
                this.opt.hasValue = true;
            },

            "test setting option with value": function (done) {
                this.a.handle([null, null, "-pfoo"], function (errors) {
                    buster.assert.isUndefined(errors);
                    done();
                });
            },

            "test setting option without value": function (done) {
                this.a.handle([null, null, "-p"], function (errors) {
                    buster.assert.equals(errors.length, 1);
                    buster.assert.match(errors[0], "-p");
                    buster.assert.match(errors[0], /is required/);
                    done();
                });
            },

            "test not setting option": function (done) {
                this.a.handle([null, null], function (errors) {
                    buster.assert.equals(errors.length, 1);
                    buster.assert.match(errors[0], "-p");
                    buster.assert.match(errors[0], /is required/);
                    done();
                });
            }
        },

        "for option without value": {
            "test setting option": function (done) {
                this.a.handle([null, null, "-p"], function (errors) {
                    buster.assert.isUndefined(errors);
                    done();
                });
            },

            "test not setting option": function (done) {
                this.a.handle([null, null], function (errors) {
                    buster.assert.equals(errors.length, 1);
                    buster.assert.match(errors[0], "-p");
                    buster.assert.match(errors[0], /is required/);
                    done();
                });
            }
        }
    }
});