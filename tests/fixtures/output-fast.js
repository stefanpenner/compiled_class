function Bar() {

}

Bar.prototype = null;
Bar.prototype.constructor = Bar;
Bar.prototype.apple = function() {

};

function Foo(options) {
  this._super$1constructor1(options);
}

Foo.prototype = Object.create(Bar.prototype);
Foo.prototype.constructor = Foo;
Foo.prototype._super$1constructor = Bar;
Foo.prototype._super$1apple = Bar.prototype.apple;

Foo.prototype.apple = function(camera) {
  this._super$1apple(camera, foo);
};

Foo.prototype.orange = function() {

};

function Controller(options) {
  this.firstName = 'stefan';
  this.lastName = 'penner';

  this._super$2constructor(options);
}

Controller.prototype = Object.create(Foo.prototype);

Controller.prototype.constructor = Controller;

Controller.prototype._super$1constructor = Bar;
Controller.prototype._super$2constructor = Foo;

Controller.prototype._super$2orange = Foo.prototype.orange;

Controller.prototype._super$2update = Foo.prototype.update;

Controller.prototype._super$2apple  = Foo.prototype.apple;

Controller.prototype.update = function(camera) {
  this._super$2orange(camera, foo);
  this._super$2update(camera, foo);
};

Controller.prototype.apple = function(camera) {
  this._super$2apple(camera, foo);
};

Controller.prototype.orange = function() {
  this._super$2orange.apply(this, arguments);
};

Controller.prototype.foo = function() {
  this._super$2orange.bar(arguments);
};

Controller.prototype.fullName = function() {
  return [
    this.fullName,
    this.lastName
  ].compact().join(' ');
};
