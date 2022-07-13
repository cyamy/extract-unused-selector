import {
  getAllClassFromHTML,
  getAllClassFromCSS,
  getNotExist,
} from './functions';

describe('getAllClassFromHTML', () => {
  test('getAllClassFromHTML - unit test', () => {
    const input = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
      </head>
      <body>
        <div class="home">
          <div class="home-inner">
            <div class="home-item-container">
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
              <div class="home-item">item</div>
            </div>
          </div>
        </div>
      </body>
    </html
    `;

    const expectResult = [
      'home',
      'home-inner',
      'home-item-container',
      'home-item',
    ].sort();
    const result = getAllClassFromHTML(input);

    expect(result).toEqual(expectResult);
  });
});

describe('getAllClassFromCSS', () => {
  test('getAllClassFromCSS - unit test', () => {
    const input = `
  .home-inner {
    padding: 2rem;
  }

  .home-item-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .home-item {
    margin: 0 auto;
    max-width: 60rem;

    &.-blue {
      background-color: blue;
    }

    &.-red {
      background-color: red;
    }
  }

  .hello-world {
    margin-top: 1rem;
  }

  .not-class {
    margin-top: 1rem;
  }
  `;

    const expectResult = [
      'home-inner',
      'home-item-container',
      'home-item',
      '-blue',
      '-red',
      'hello-world',
      'not-class',
    ].sort();
    const result = getAllClassFromCSS(input);

    expect(result).toEqual(expectResult);
  });
});

describe('getNotExist', () => {
  test('getNotExist - unit test', () => {
    const html = ['home', 'home-inner', 'home-item-container', 'home-item'];

    const css = [
      'home-inner',
      'home-item-container',
      'home-item',
      '-blue',
      '-red',
    ];

    const expectResult = ['-blue', '-red'];

    const result = getNotExist(html, css);

    expect(result).toEqual(expectResult);
  });
});