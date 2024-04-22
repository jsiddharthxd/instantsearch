/**
 * @jest-environment jsdom
 */
/** @jsx h */

import { mount, shallow } from '@instantsearch/testutils/enzyme';
import { render } from '@testing-library/preact';
import { h } from 'preact';

import { warning } from '../../../lib/utils';
import Template from '../Template';

import type { TemplateProps } from '../Template';

function getProps({
  templates = { test: '' },
  data = {},
  templateKey = 'test',
  rootProps = {},
  useCustomCompileOptions = {},
  templatesConfig = { helpers: {}, compileOptions: {} },
  ...props
}: Partial<TemplateProps>) {
  return {
    ...props,
    templates,
    data,
    templateKey,
    rootProps,
    useCustomCompileOptions,
    templatesConfig,
  };
}

describe('Template', () => {
  afterEach(() => {
    warning.cache = {};
  });

  it('can configure compilation options', () => {
    const props = getProps({
      templates: { test: 'it configures compilation <%options%>' },
      data: { options: 'delimiters' },
      useCustomCompileOptions: { test: true },
      templatesConfig: { helpers: {}, compileOptions: { delimiters: '<% %>' } },
    });
    const wrapper = mount(<Template {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('can configure custom rootTagName', () => {
    const props = getProps({ rootTagName: 'span' });
    const wrapper = mount(<Template {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('can have Fragment as rootTagName with string template', () => {
    const props = getProps({
      rootTagName: 'fragment',
      templates: { test: 'Hello <span>{{name}}</span> !' },
      data: { name: 'world' },
    });
    const wrapper = render(<Template {...props} />);

    expect(wrapper.container).toMatchSnapshot();

    props.data = { name: 'world2' };

    wrapper.rerender(<Template {...props} />);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('can have Fragment as rootTagName with Preact template', () => {
    const props = getProps({
      rootTagName: 'fragment',
      templates: { test: () => <span>test</span> },
    });
    const wrapper = render(<Template {...props} />);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('can have Fragment as rootTagName with simple string', () => {
    const props = getProps({
      rootTagName: 'fragment',
      templates: { test: 'test' },
    });
    const wrapper = render(<Template {...props} />);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('forward rootProps to the first node', () => {
    function onClick() {}

    const props = getProps({
      rootProps: { className: 'className', onClick },
    });
    const wrapper = mount(<Template {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('warns when using string-based templates', () => {
    expect(() =>
      render(
        <Template
          {...getProps({ templates: { test: 'test', test2: () => 'test' } })}
        />
      )
    )
      .toWarnDev(`[InstantSearch.js]: Hogan.js and string-based templates are deprecated and will not be supported in InstantSearch.js 5.x.

You can replace them with function-form templates and use either the provided \`html\` function or JSX templates.

String-based templates: test.

See: https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/#upgrade-templates`);
  });

  it('does not warn when using exclusively function-based templates', () => {
    expect(() =>
      render(<Template {...getProps({ templates: { test: () => 'test' } })} />)
    ).not.toWarnDev();
  });

  describe('shouldComponentUpdate', () => {
    it('does not call render when no change in data', () => {
      const props = getProps({
        data: {
          items: [],
        },
      });
      const wrapper = shallow(<Template {...props} />);
      const onRender = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({ data: { items: [] } });

      expect(onRender).toHaveBeenCalledTimes(0);
    });

    it('calls render when data changes', () => {
      const props = getProps({
        data: {
          items: [],
        },
      });
      const wrapper = shallow(<Template {...props} />);
      const onRender = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({ data: { items: [1] } });

      expect(onRender).toHaveBeenCalledTimes(1);
    });

    it('calls render when templateKey changes', () => {
      const props = getProps({});
      const wrapper = shallow(<Template {...props} />);
      const onRender = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({
        templateKey: 'newTemplateKey',
        templates: {
          newTemplateKey: '',
        },
      });

      expect(onRender).toHaveBeenCalledTimes(1);
    });

    it('calls render when rootProps changes', () => {
      const props = getProps({});
      const wrapper = shallow(<Template {...props} />);
      const onRender = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({
        rootProps: {
          className: 'newClassName',
        },
      });

      expect(onRender).toHaveBeenCalledTimes(1);
    });

    it('does not call render when rootProps remain unchanged', () => {
      const props = getProps({
        rootProps: {
          className: 'initialClassName',
        },
      });
      const wrapper = shallow(<Template {...props} />);
      const onRender = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({
        rootProps: {
          className: 'initialClassName',
        },
      });

      expect(onRender).toHaveBeenCalledTimes(0);
    });
  });
});
