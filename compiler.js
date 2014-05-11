var esprima = require('esprima');
var escodegen = require('escodegen');
var util = require('util');
var fs = require('fs');

function replace(array, a, b) {
  var index = array.indexOf(a);
  if (index > -1) {

    if (!util.isArray(a)) { a = [a]; }
    if (!util.isArray(b)) { b = [b]; }

    array.splice(index, a.length); // remove original statement
    // insert new
    for (var i = 0; i < b.length; i++) {
      array.splice(index + i, 0, b[i]);
    }
  }
}

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
  var key, child;

  if (visitor.call(null, object) === false) {
    return;
  }
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor);
      }
    }
  }
}

function extractFunctions(expressions) {
  var functions = { };
  expressions.forEach(function(expression) {
    if (expression.type === 'MethodDefinition') {
      var value = expression.value;
      functions[expression.key.name] = {
        type: 'FunctionDeclaration',
        params: value.params,
        body: value.body
      };
    }
  });

  return functions;
}

function setPrototype(className, superClass) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: {
        type: "MemberExpression",
        computed: false,
        object: {
          type: "Identifier",
          name: "Controller"
        },
        property: {
          type: "Identifier",
          name: "prototype"
        }
      },
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          computed: false,
          object: {
            type: "Identifier",
            name: "Object"
          },
          property: {
            type: "Identifier",
            name: "create"
          }
        },
        arguments: [{
          type: "Identifier",
          name: "Foo"
        }]
      }
    }
  };
}

function addToPrototype(className, propertyName, expression) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'MemberExpression',
          computed: false,
          object: {
            type: 'Identifier',
            name: className
          },
          property: {
            type: 'Identifier',
            name: 'prototype'
          }
        },
        property: {
          type: 'Identifier',
          name: propertyName
        }
      },
      right: expression
    }
  };
}

function handleSuperCall(node) {
  //var args = node.expression.arguments;

  //args.unshift({
  //  type: 'ThisExpression'
  //});

  //// constructor
  //node.expression = {
  //  type: 'CallExpression',
  //  callee: {
  //    type: 'MemberExpression',
  //    computed: false,
  //    object: {
  //      type: 'MemberExpression',
  //      computed: false,
  //      object: {
  //        type: 'ThisExpression'
  //      },
  //      property: {
  //        type: 'Identifier',
  //        name: 'constructor'
  //      }
  //    },
  //    property: {
  //      type: 'Identifier',
  //      name: 'call'
  //    }
  //  },
  //  arguments: args
  //};
}

function handleCallOnSuperMember(node) {
  var callee = node.expression.callee;
  callee.object = {
    type: 'MemberExpression',
    computed: false,
    object: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'ThisExpression'
        },
        property: {
          type: 'Identifier',
          name: 'constructor'
        }
      },
      property: {
        type: 'Identifier',
        name: 'prototype'
      }
    },
    property: {
      type: 'Identifier',
      name: callee.object.property.name
    }
  };
}

// only with 'call' not apply
function handleCallOnSuper(node) {
  var callee = node.expression.callee;
  callee.object = {
    type: 'MemberExpression',
    computed: false,
    object: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'ThisExpression'
        },
        property: {
          type: 'Identifier',
          name: 'constructor'
        }
      },
      property: {
        type: 'Identifier',
        name: 'prototype'
      }
    },
    property: {
      type: 'Identifier',
      name: callee.property.name
    }
  };

  callee.property = {
    type: 'Identifier',
    name: 'call'
  };

  node.expression.arguments.unshift({
    type: 'ThisExpression'
  });
}

function setConstructor(className) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: {
        type: "MemberExpression",
        computed: false,
        object: {
          type: "MemberExpression",
          computed: false,
          object: {
            type: "Identifier",
            name: className
          },
          property: {
            type: "Identifier",
            name: "prototype"
          }
        },
        property: {
          type: "Identifier",
          name: "constructor"
        }
      },
      right: {
        type: "Identifier",
        name: className
      }
    }
  };
}


var handlers = {
  ExpressionStatement: function(parent, node) {
    var handler = handlers[node.expression.type];
    if (handler) {
      handler(parent, node);
    }
  },

  CallExpression: function(parent, node) {
    var callee = node.expression.callee;
    var object = callee.object;
    if (callee.name === 'super') {
      handleSuperCall(node);
    } else if (object.type === 'Identifier' && object.name === 'super') {
      handleCallOnSuper(node);
    } else if (object.type === 'MemberExpression' && object.object.name === 'super') {
      handleCallOnSuperMember(node);
    }
  },

  ClassDeclaration: function(parent, node, index) {
    // var c = new Class(name, superClassName);
    // c.addFunction(name, fn);
    // c.addFunction(name, fn);
    // replace(parent.body, node, c.toNodes());
    var body = node.body.body;
    var functions = extractFunctions(body);
    var classDefinition = [];

    var className = node.id.name;
    var superClass = node.superClass;

    delete node.body;
    delete node.superClass;

    node.type = 'FunctionDeclaration';
    node.params = functions.constructor.params;
    node.body = functions.constructor.body;

    delete functions.constructor;

    classDefinition.push(node);

    if (superClass) {
      classDefinition.push(setPrototype(className, superClass.name));
    }

    classDefinition.push(setConstructor(className));

    Object.keys(functions).forEach(function(name) {
      var fn = functions[name];
      fn.type = 'FunctionExpression';
      classDefinition.push(addToPrototype(className, name, fn));
    });

    replace(parent.body, node, classDefinition);
  }
};

module.exports.compile = function(code) {
  var ast = esprima.parse(code);

  traverse(ast, function(parent) {
    if (parent && parent.body) {
      for (var i = 0; i < parent.body.length; i++) {
        var node = parent.body[i];

        var handler = handlers[node.type];

        if (handler) {
          handler(parent, node, i);
        }
      }
    }
  });

  return escodegen.generate(ast);
};
