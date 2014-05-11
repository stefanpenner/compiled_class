function Controller(options) {
  this.firstName = 'stefan';
  this.lastName = 'penner';

  super(options);
}
Controller.prototype = Object.create(Foo);
Controller.prototype.constructor = Controller;
Controller.prototype.update = function(camera) {
  this.constructor.prototype.update.call(this, camera, foo);
  this.constructor.prototype.orange.call(this, camera, foo);
};
Controller.prototype.apple = function(camera) {
  this.constructor.prototype.apple.apply(this, [camera, foo]);
};
Controller.prototype.orange = function() {
  this.constructor.prototype.orange.apply(this, arguments);
};
Controller.prototype.foo = function() {
  this.constructor.prototype.orange.bar(arguments);
};
Controller.prototype.fullName = function() {
  return [
    this.fullName,
    this.lastName
  ].compact().join(' ');
};
