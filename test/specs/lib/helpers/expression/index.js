'use strict';

describe('lib/helpers/expression', function() {
    var expression;
    var handlebars = require('handlebars');
    var helpers = require('../../../helpers');
    var SafeString = handlebars.SafeString;
    var templateHelper = require('jsdoc/util/templateHelper');

    helpers.setup();
    expression = require('../../../../lib/helpers/expression');

    it('should export a function', function() {
        expect(typeof expression).toBe('function');
    });

    it('should return an object', function() {
        var instance = expression(helpers.template);
        expect(typeof instance).toBe('object');
    });

    describe('helpers', function() {
        var instance = expression(helpers.template);

        describe('_decrementHeading', function() {
            beforeEach(function() {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            });

            it('should reduce the heading level by 1', function() {
                var newLevel;
                var oldLevel;

                instance._incrementHeading();
                oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel - newLevel).toBe(1);
            });

            it('should not reduce the heading level below 1', function() {
                var newLevel;
                var oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel).toBe(1);
                expect(newLevel).toBe(1);
            });
        });

        describe('_headingLevel', function() {
            it('should return a positive number', function() {
                var level = instance._headingLevel();

                expect(level).toBeNumber();
                expect(level).toBeGreaterThan(0);
            });
        });

        describe('_incrementHeading', function() {
            function decrement() {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            }

            beforeEach(decrement);
            afterEach(decrement);

            it('should increase the heading level by 1', function() {
                var newLevel;
                var oldLevel = instance._headingLevel();

                instance._incrementHeading();
                newLevel = instance._headingLevel();

                expect(newLevel - oldLevel).toBe(1);
            });

            it('should not increase the heading level above 6', function() {
                for (var i = 0, l = 10; i < l; i++) {
                    instance._incrementHeading();
                }

                expect(instance._headingLevel()).toBe(6);
            });
        });

        xdescribe('ancestors', function() {
            // TODO
        });

        xdescribe('config', function() {
            // TODO
        });

        xdescribe('continuedId', function() {
            // TODO
        });

        xdescribe('continuedIdNext', function() {
            // TODO
        });

        xdescribe('cssClass', function() {
            // TODO
        });

        describe('debug', function() {
            it('should log the JSON-stringified arguments at level DEBUG', function() {
                var logger = require('jsdoc/util/logger');

                spyOn(logger, 'debug');

                instance.debug('foo', {
                    bar: 'baz'
                }, { /* fake options object */ });

                expect(logger.debug).toHaveBeenCalled();
                expect(logger.debug).toHaveBeenCalledWith('foo {"bar":"baz"}');
            });
        });

        describe('describeType', function() {
            var catharsis = require('catharsis');

            var parsedType = catharsis.parse('!string');

            it('should use "unknown type" if no type is provided', function() {
                var description = instance.describeType(undefined);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('unknown');
            });

            it('should throw if the requested format is not available', function() {
                function shouldThrow() {
                    return instance.describeType(parsedType, 'marshmallow');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the simple description by default', function() {
                var description = instance.describeType(parsedType);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('non-null string');
            });

            it('should return the extended format\'s description by default when the format is ' +
                '"extended"', function() {
                var description = instance.describeType(parsedType, 'extended');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('string');
            });

            it('should return the requested property when the format is "extended"', function() {
                var description = instance.describeType(parsedType, 'extended',
                    'modifiers.nullable');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('Must not be null.');
            });
        });

        describe('example', function() {
            it('should work when the example does not have a caption', function() {
                var example = instance.example('Some example text');

                expect(example.caption).toBeUndefined();
                expect(example.code).toBe('Some example text');
            });

            it('should work when the example has a caption', function() {
                var example = instance.example('<caption>Caption here</caption> Some example text');

                expect(example.caption).toBe('Caption here');
                expect(example.code).toBe('Some example text');
            });
        });

        xdescribe('formatParams', function() {
            // TODO
        });

        describe('generatedBy', function() {
            it('should include the JSDoc version number', function() {
                var generatedBy = instance.generatedBy();

                expect(generatedBy).toBeInstanceOf(SafeString);
                expect(generatedBy.toString()).toContain(global.env.version.number);
            });

            it('should include the date', function() {
                var generatedBy = instance.generatedBy();

                expect(generatedBy.toString()).toContain(new Date(Date.now()).getFullYear());
            });
        });

        xdescribe('group', function() {
            // TODO
        });

        describe('hasModifiers', function() {
            it('should treat the "defaultValue" property as a modifier for non-enums', function() {
                var fakeDoclet = {
                    defaultValue: 'foo'
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "defaultValue" property as a modifier for enums', function() {
                var fakeDoclet = {
                    defaultValue: 'foo',
                    isEnum: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "nullable" property as a modifier', function() {
                var fakeDoclet = {
                    nullable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "optional" property as a modifier', function() {
                var fakeDoclet = {
                    optional: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "variable" (repeatable) property as a modifier', function() {
                var fakeDoclet = {
                    variable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });
        });

        xdescribe('id', function() {
            // TODO
        });

        xdescribe('isContinued', function() {
            // TODO
        });

        describe('jsdocVersion', function() {
            it('should return the version number as a string', function() {
                // look for the fake version number set by the test helpers
                expect(instance.jsdocVersion()).toBe('1.2.3.4');
            });
        });

        describe('json', function() {
            it('should JSON-stringify its argument', function() {
                var stringified = instance.json({foo: 'bar'});

                expect(stringified).toBeInstanceOf(SafeString);
                expect(stringified.toString()).toBe('{"foo":"bar"}');
            });
        });

        describe('keys', function() {
            it('should throw an error if the argument is not an object', function() {
                function shouldThrow() {
                    return instance.keys('hello');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the object\'s keys as an array', function() {
                var keys = instance.keys({
                    foo: true,
                    bar: '1',
                    baz: null
                });

                expect(keys).toBeArray();
                expect(keys.length).toBe(3);

                keys.sort();
                expect(keys[0]).toBe('bar');
                expect(keys[1]).toBe('baz');
                expect(keys[2]).toBe('foo');
            });
        });

        xdescribe('labels', function() {
            // TODO
        });

        describe('licenseLink', function() {
            it('should return a URL if a valid license ID is specified', function() {
                expect(instance.licenseLink('MIT')).toContain('http://');
            });

            it('should return the license ID if no link is found', function() {
                expect(instance.licenseLink('fuzzy-bunny')).toBe('fuzzy-bunny');
            });
        });

        xdescribe('link', function() {
            // TODO
        });

        xdescribe('linkLongnameWithSignature', function() {
            // TODO
        });

        describe('linkToLine', function() {
            // TODO: more tests

            it('should ignore the context object', function() {
                var fakeDocletMeta = {
                    lineno: 70,
                    shortpath: 'glitch.js'
                };
                var link;

                templateHelper.registerLink('glitch.js', 'glitch.js.html');
                link = instance.linkToLine(fakeDocletMeta, {});

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70">glitch.<wbr>js:70</a>'
                );
            });
        });

        xdescribe('linkToTutorial', function() {
            // TODO
        });

        xdescribe('linkWithSignature', function() {
            // TODO
        });

        describe('modifierText', function() {
            it('should return text if the doclet is nullable', function() {
                var fakeDoclet = {
                    nullable: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet is non-nullable', function() {
                var fakeDoclet = {
                    nullable: false
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a "variable" property set to true',
                function() {
                var fakeDoclet = {
                    variable: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a default value and is not an enum',
                function() {
                var fakeDoclet = {
                    defaultValue: '1'
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should not return text if the doclet has a default value and is an enum',
                function() {
                var fakeDoclet = {
                    defaultValue: '1',
                    isEnum: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('');
            });
        });

        xdescribe('moveChildren', function() {
            // TODO
        });

        describe('needsSignature', function() {
            it('should say that classes need a signature', function() {
                var fakeDoclet = {
                    kind: 'class'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that functions need a signature', function() {
                var fakeDoclet = {
                    kind: 'function'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that typedefs need a signature if they contain a function', function() {
                var fakeDoclet = {
                    kind: 'typedef',
                    type: {
                        names: [
                            'function'
                        ]
                    }
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that typedefs do not need a signature if they do not contain a function',
                function() {
                var fakeDoclet = {
                    kind: 'typedef',
                    type: {
                        names: [
                            'Object'
                        ]
                    }
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(false);
            });

            it('should say that other types do not need a signature', function() {
                var fakeDoclet = {
                    kind: 'member'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(false);
            });
        });

        xdescribe('packageLink', function() {
            // TODO
        });

        xdescribe('parseType', function() {
            // TODO
        });

        describe('pluck', function() {
            it('should return an array of the specified property\'s values', function() {
                var objs = [
                    {
                        foo: true
                    },
                    {
                        foo: 7
                    }
                ];
                var plucked = instance.pluck(objs, 'foo');

                expect(plucked).toBeArray();
                expect(plucked.length).toBe(2);
                expect(plucked[0]).toBe(true);
                expect(plucked[1]).toBe(7);
            });
        });

        xdescribe('resolveAuthorLinks', function() {
            // TODO
        });

        xdescribe('resolveLinks', function() {
            // TODO
        });

        xdescribe('returnTypes', function() {
            // TODO
        });

        xdescribe('see', function() {
            // TODO
        });

        xdescribe('shouldHighlight', function() {
            // TODO
        });

        xdescribe('translate', function() {
            // TODO
        });

        xdescribe('translateHeading', function() {
            // TODO
        });

        describe('translatePageTitle', function() {
            it('should return the specified text when there is no category', function() {
                var title = instance.translatePageTitle('Foo bar');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toBe('Foo bar');
            });

            it('should include the specified text in the generated title', function() {
                var title = instance.translatePageTitle('Foo bar', 'classes');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toContain('Foo bar');
            });
        });

        xdescribe('typeUnion', function() {
            // TODO
        });
    });
});