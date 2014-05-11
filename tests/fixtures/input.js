class Controller extends Foo {
  constructor(options) {
    this.firstName = 'stefan';
    this.lastName = 'penner';

    super(options);
  }

  update(camera) {
    super.update(camera, foo);
    super.orange(camera, foo);
  }

  apple(camera) {
    super.apple.apply(this, [camera, foo]);
  }

  orange () {
    super.orange.apply(this, arguments);
  }

  foo () {
    super.orange.bar(arguments);
  }

  fullName() {
    return [
      this.fullName,
      this.lastName
    ].compact().join(' ');
  }
}
