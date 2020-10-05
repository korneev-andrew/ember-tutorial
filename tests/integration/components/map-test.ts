import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import ENV from 'ember-tutorial/config/environment';

module('Integration | Component | map', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function(assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert.dom('.map').exists();
    assert.dom('.map img').hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184');
    assert.dom('.map img').hasAttribute('src', /^https:\/\/api\.mapbox\.com/, 'the src starts with "https://api.mapbox.com"');
    assert.dom('.map img').hasAttribute('width', '150');
    assert.dom('.map img').hasAttribute('height', '120');

    const { src } = find('.map img')! as HTMLImageElement;
    const token = encodeURIComponent(ENV.APP['MAPBOX_ACCESS_PUBLIC_TOKEN'] as string);

    assert.ok(src.includes('-122.4184,37.7797,10'), 'the src should include the lng,lat,zoom parameter');
    assert.ok(src.includes('150x120@2x'), 'the src should include the width,height and @2x parameter');
    assert.ok(src.includes(`access_token=${token}`), 'the src should include the escaped access token');
  });

  test('the default alt attribute can be overridden', async function(assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function(assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert.dom('.map img').hasAttribute('src', /^https:\/\/api\.mapbox\.com/, 'the src starts with "https://api.mapbox.com"');
    assert.dom('.map img').hasAttribute('width', '150');
    assert.dom('.map img').hasAttribute('height', '120');
  });
});