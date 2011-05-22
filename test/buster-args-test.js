var buster = require("buster");
var busterArgs = require("./../lib/buster-args");

buster.testCase("buster-args single dash option", {
    setUp: function () {
        this.a = Object.create(busterArgs);
    },

    "test one option": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 1);
            done();
        });
    },

    "test one option twice as separate options": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-p", "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 2);
            done();
        });
    },

    "test one option thrice as separate options": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-p", "-p", "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 3);
            done();
        });
    },

    "test one option twice as one grouped option": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-pp"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 2);
            done();
        });
    },

    "test one option thrice as one grouped option": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-ppp"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 3);
            done();
        });
    },

    "test one option thrice as bith grouped and separate": function (done) {
        var opt = this.a.createOption("-p");
        this.a.handle([null, null, "-pp", "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 3);
            done();
        });
    },

    "test two options as separate args": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-p", "-z"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        });
    },

    "test two options as one arg": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pz"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        });
    },

    "test two options two times grouped with self": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pp", "-zz"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 2);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 2);

            done();
        });
    },

    "test two options two times grouped with other": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pz", "-zp"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 2);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 2);

            done();
        });
    },

    "test two options where only one occurs": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);

            buster.assert(!opt2.isSet);

            done();
        });
    },

    "test two options each occurring thrice": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pzz", "-ppz"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 3);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 3);

            done();
        });
    },

    "test option with value": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;

        this.a.handle([null, null, "-pfoo"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test option with value but no value passed": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.isUndefined(opt.value());
            done();
        });
    },

    "test option with value and default value": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;
        opt.defaultValue = "bar";

        this.a.handle([null, null, "-pfoo"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test option without value but with default value": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;
        opt.defaultValue = "bar";

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "bar");
            done();
        });
    },

    "test passing value matching other option": function (done) {
        var opt1 = this.a.createOption("-p");
        opt1.hasValue = true;
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pz"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.value(), "z");

            buster.assert(!opt2.isSet);

            done();
        });
    },

    "test passing value matching other option as well as that other option": function (done) {
        var opt1 = this.a.createOption("-p");
        opt1.hasValue = true;
        var opt2 = this.a.createOption("-z");

        this.a.handle([null, null, "-pz", "-z"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.value(), "z");

            buster.assert(opt2.isSet);

            done();
        });
    },

    "test passing value to option with value with space between option and value": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;

        this.a.handle([null, null, "-p", "foo"], function (errors) {
            buster.assert.isUndefined(errors);
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test passing value to option without value with space between option and value": function (done) {
        var opt = this.a.createOption("-p");

        this.a.handle([null, null, "-p", "foo"], function (errors) {
            buster.assert.match(errors[0], /unknown argument/i);
            buster.assert.match(errors[0], "foo");
            done();
        });
    },

    "test passing value to option with value using equals": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;

        this.a.handle([null, null, "-p=foo"], function (errors) {
            buster.assert.isUndefined(errors);
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test passing value to option without value using equals": function (done) {
        var opt = this.a.createOption("-p");

        this.a.handle([null, null, "-p=foo"], function (errors) {
            buster.assert.match(errors[0], /does not have a value/i);
            buster.assert.match(errors[0], "-p");
            done();
        });
    },

    "test equals sign with spaces": function (done) {
        var opt = this.a.createOption("-p");
        opt.hasValue = true;

        this.a.handle([null, null, "-p", "=", "123"], function (errors) {
            buster.assert.equals(opt.value(), "=");
            buster.assert.match(errors[0], /unknown argument/i);
            buster.assert.match(errors[0], "123");
            done();
        });
    }
});

buster.testCase("buster-args double dash option", {
    setUp: function () {
        this.a = Object.create(busterArgs);
    },

    "test one option": function (done) {
        var opt = this.a.createOption("--port");
        this.a.handle([null, null, "--port"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 1);
            done();
        });
    },

    "test one option twice as separate options": function (done) {
        var opt = this.a.createOption("--port");
        this.a.handle([null, null, "--port", "--port"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 2);
            done();
        });
    },

    "test one option thrice as separate options": function (done) {
        var opt = this.a.createOption("--port");
        this.a.handle([null, null, "--port", "--port", "--port"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.timesSet, 3);
            done();
        });
    },

    "test two options both being set": function (done) {
        var opt1 = this.a.createOption("--port");
        var opt2 = this.a.createOption("--zap");

        this.a.handle([null, null, "--port", "--zap"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        });
    },

    "test option with value": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;
        this.a.handle([null, null, "--port", "foo"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test option with value but no value passed": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;

        this.a.handle([null, null, "--port"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.isUndefined(opt.value());
            done();
        });
    },

    "test option with value and default value": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;
        opt.defaultValue = "bar";

        this.a.handle([null, null, "--port", "foo"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test option without value but with default value": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;
        opt.defaultValue = "bar";

        this.a.handle([null, null, "--port"], function (errors) {
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "bar");
            done();
        });
    },

    "test passing value matching other option": function (done) {
        var opt1 = this.a.createOption("--port");
        opt1.hasValue = true;
        var opt2 = this.a.createOption("--zap");

        this.a.handle([null, null, "--port", "--zap"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.isUndefined(opt1.value());

            buster.assert(opt2.isSet);

            done();
        });
    },

    "test passing value to option with value using equals": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;

        this.a.handle([null, null, "--port=foo"], function (errors) {
            buster.assert.isUndefined(errors);
            buster.assert(opt.isSet);
            buster.assert.equals(opt.value(), "foo");
            done();
        });
    },

    "test passing value to option without value using equals": function (done) {
        var opt = this.a.createOption("--port");

        this.a.handle([null, null, "--port=foo"], function (errors) {
            buster.assert.match(errors[0], /does not have a value/i);
            buster.assert.match(errors[0], "--port");
            done();
        });
    },

    "test equals sign with spaces": function (done) {
        var opt = this.a.createOption("--port");
        opt.hasValue = true;

        this.a.handle([null, null, "--port", "=", "123"], function (errors) {
            buster.assert.equals(opt.value(), "=");
            buster.assert.match(errors[0], /unknown argument/i);
            buster.assert.match(errors[0], "123");
            done();
        });
    }
});

buster.testCase("buster-args mix and match", {
    setUp: function () {
        this.a = Object.create(busterArgs);
    },

    "test handling none existing option errors": function (done) {
        this.a.createOption("-p");
        this.a.handle([null, null, "-z"], function (errors) {
            buster.assert.equals(errors.length, 1);
            buster.assert.match(errors[0], /unknown argument/i)
            buster.assert.match(errors[0], "-z")

            done();
        });
    },

    "test one and two dash option with both passed, single dash first": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("--port");

        this.a.handle([null, null, "-p", "--port"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);
            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        });
    },

    "test one and two dash option with both passed, double dash first": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("--port");

        this.a.handle([null, null, "--port", "-p"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);
            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        }); 
    },

    "test one and two dash option with only double dash passed": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("--port");

        this.a.handle([null, null, "--port"], function (errors) {
            buster.assert(!opt1.isSet);

            buster.assert(opt2.isSet);
            buster.assert.equals(opt2.timesSet, 1);

            done();
        }); 
    },

    "test one and two dash option with only single dash passed": function (done) {
        var opt1 = this.a.createOption("-p");
        var opt2 = this.a.createOption("--port");

        this.a.handle([null, null, "-p"], function (errors) {
            buster.assert(opt1.isSet);
            buster.assert.equals(opt1.timesSet, 1);

            buster.assert(!opt2.isSet);

            done();
        }); 
    }
});