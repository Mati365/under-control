<p align='center'>
  <picture>
    <source media='(prefers-color-scheme: dark)' srcset='assets/social/under-control-banner.png'>
    <img src='assets/social/under-control-banner.png' alt='Banner'>
  </picture>

  <h1 align='center'>under-control</h1>
</p>

<div align='center'>

[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/00361e89d67049baa02723ee0e818ed0?style=for-the-badge)](https://www.codacy.com/gh/Mati365/under-control/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Mati365/under-control&utm_campaign=Badge_Coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/00361e89d67049baa02723ee0e818ed0)](https://www.codacy.com/gh/Mati365/under-control/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Mati365/under-control&utm_campaign=Badge_Grade)
[![NPM](https://img.shields.io/npm/l/@under-control/core?style=flat)](LICENSE)
![NPM Downloads](https://img.shields.io/npm/dm/@under-control/core)
![NPM version](https://img.shields.io/npm/v/@under-control/core)

</div>

<p align='center'>
  Are you losing sanity every time you need to make a form? Are you tired enough of all antipatterns and cursed React frameworks? Screw that! Treat all forms and inputs as a recursive composable controls! <b>under-control</b> is a lightweight alternative to libraries such as <b>react-hook-form</b>, <b>formik</b>, <b>react-ts-form</b>, which, unlike them, allows you to turn your components into controllable controls.
</p>

![Object type check example](assets/examples/type-check-object.png 'Type check object with array')

## 📖 Docs

- [📖 Docs](#-docs)
- [🚀 Quick start](#-quick-start)
  - [📦 Install](#-install)
  - [✨ Features](#-features)
- [📝 Forms](#-forms)
  - [⚠️ Forms without validation](#️-forms-without-validation)
  - [✅ Forms with validation](#-forms-with-validation)
  - [Single validator](#single-validator)
  - [Multiple validators](#multiple-validators)
- [🏗️ Composition](#️-composition)
  - [useControl](#usecontrol)
- [License](#license)

## 🚀 Quick start

### 📦 Install

[![Edit React Typescript (forked)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-typescript-forked-jt16nb?fontsize=14&hidenavigation=1&theme=dark)

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@under-control/forms)

```bash
npm install @under-control/forms
```

### ✨ Features

- Small size, it is around 4x smaller than **react-hook-form** and weights ~2.6kb (gzip).
- Performance. Automatic caching of callbacks that binds controls. Modification of control A is not triggering rerender on control B.
- Built in mind to be type-safe. Provides type-safe validation and controls binding.
- Allows you to turn any component into a control with `value` and `onChange` properties. Treat your custom select-box the same as it would be plain `<select />` tag!
- Better encapsulation of data. Due to low `context` usage it allows you to reuse built controllable controls in other forms.
- Provides rerender-free control value side effects. Modify of control can reset value of form without doing additional `useEffect`.
- Exports additional hooks such as `use-promise-callback` / `use-update-effect` that can be reused in your project.
- Highly testes codebase with 100% coverage.

## 📝 Forms

### ⚠️ Forms without validation

The simplest possible form, without added validation:

```tsx
import { useForm } from '@under-control/forms';

const Form = () => {
  const { bind, handleSubmitEvent, isDirty } = useForm({
    defaultValue: {
      a: '',
      b: '',
    },
    onSubmit: async data => {
      console.info('Submit!', data);
    },
  });

  return (
    <form onSubmit={handleSubmitEvent}>
      <input type="text" {...bind.path('a')} />
      <input type="text" {...bind.path('b')} />
      <input type="submit" value="Submit" disabled={!isDirty} />
    </form>
  );
};
```

[![Edit not-validated-form](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/not-validated-form-5osyih?fontsize=14&hidenavigation=1&theme=dark)

### ✅ Forms with validation

Validation by default can result sync or async result and can be run in these modes:

1. `blur` - when user blurs any input. In this mode `bind.path` returns also `onBlur` handler. You have to assign it to input otherwise this mode will not work properly.
2. `change` - when user changes any control (basically when `getValue()` changes)
3. `submit` - when user submits form

Each validator can result also single error or array of errors with optional paths to inputs.

### Single validator

Example of form that performs validation on `blur` or `submit` event.

```tsx
import { useForm, error, flattenMessagesList } from '@under-control/forms';

const Form = () => {
  const { bind, handleSubmitEvent, isDirty, validator } = useForm({
    defaultValue: {
      a: '',
      b: '',
    },
    validation: {
      mode: ['blur', 'submit'],
      validators: ({ global }) =>
        global(({ value: { a, b } }) => {
          if (!a || !b) {
            return error('Fill all required fields!');
          }
        }),
    },
    onSubmit: async data => {
      console.info('Submit!', data);
    },
  });

  return (
    <form onSubmit={handleSubmitEvent}>
      <input type="text" {...bind.path('a')} />
      <input type="text" {...bind.path('b')} />
      <input type="submit" value="Submit" disabled={!isDirty} />
      <div>{flattenMessagesList(validator.errors.all).join(',')}</div>
    </form>
  );
};
```

[![Edit validated-form](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/validated-form-3rb96u?fontsize=14&hidenavigation=1&theme=dark)

### Multiple validators

Multiple validators can be provided. In example above `global` validator validates all inputs at once. If you want to assign error to specific input you can:

1. Return `error("Your error", null "path.to.control")` function call in `all` validator.
2. User `path` validator and return plain `error("Your error")`.

Example:

```tsx
const form = useForm({
  validation: {
    mode: ["blur", "submit"],
    validators: ({ path, global }) => [
      global(({ value: { a, b } }) => {
        if (!a || !b) {
          return error("Fill all required fields!");
        }

        if (b === "World") {
          return error("It cannot be a world!", null, "b");
        }
      }),
      path("a.c", ({ value }) => {
        if (value === "Hello") {
          return error("It should not be hello!");
        }
      })
    ]
  },
  defaultValue: {
    a: {
      c: ""
    },
    b: ""
  },
  ...
});
```

[![Edit advanced-validation](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/advanced-validation-jt16nb?fontsize=14&hidenavigation=1&theme=dark)

## 🏗️ Composition

Build and treat your forms as composable set of controlled controls. Do not mess with implementing `value` / `onChange` logic each time when you create standalone controls.

Example:

```tsx
import { controlled } from '@under-control/forms';

type PrefixValue = {
  prefix: string;
  name: string;
};

const PrefixedInput = controlled<PrefixValue>(({ control: { bind } }) => (
  <>
    <input type="text" {...bind.path('prefix')} />
    <input type="text" {...bind.path('name')} />
  </>
));
```

Usage in bigger component:

```tsx
import { controlled } from '@under-control/forms';
import { PrefixedInput } from './prefixed-input';

type PrefixPair = {
  a: PrefixValue;
  b: PrefixValue;
};

const PrefixedInputGroup = controlled<PrefixPair>(({ control: { bind } }) => (
  <>
    <PrefixedInput {...bind.path('a')} />
    <PrefixedInput {...bind.path('b')} />
  </>
));
```

`onChange` output from `PrefixedInput` component:

```tsx
{
  a: { prefix, name },
  b: { prefix, name }
}
```

### useControl

Bind entire state to input:

```tsx
import { useControl } from '@under-control/inputs';

const Component = () => {
  const { bind } = useControl({
    defaultValue: 'Hello world',
  });

  return <input type="text" {...bind.entire()} />;
};
```

Bind single state property to input:

```tsx
import { useControl } from '@under-control/inputs';

const Component = () => {
  const { bind } = useControl({
    defaultValue: {
      message: {
        nested: ['Hello world'],
      },
    },
  });

  return <input type="text" {...bind.path('message.nested[0]')} />;
};
```

Map single property and map it to input:

```tsx
import { useControl } from '@under-control/inputs';

const Component = () => {
  const { bind } = useControl({
    defaultValue: {
      message: {
        nested: ['Hello world'],
      },
    },
  });

  return (
    <input
      type="text"
      {...bind.path('message.nested[0]', {
        input: str => `${str}!`, // appends `!` value stored in message.nested[0]
      })}
    />
  );
};
```

## License

[MIT](LICENSE)
