import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { noop } from 'markmap-common';
import { ITransformHooks } from '../types';
import { definePlugin } from './base';
import config from './prism.config';

const name = 'prism';

export default definePlugin({
  name,
  config,
  transform(transformHooks: ITransformHooks) {
    let enableFeature = noop;
    transformHooks.parser.tap((md) => {
      md.set({
        highlight: (str: string, lang: string) => {
          enableFeature();
          let grammar = Prism.languages[lang];
          if (!grammar && lang) {
            loadLanguages([lang]);
            grammar = Prism.languages[lang];
          }
          if (grammar) {
            return Prism.highlight(str, grammar, lang);
          }
          return '';
        },
      });
    });
    transformHooks.beforeParse.tap((_, context) => {
      enableFeature = () => {
        context.features[name] = true;
      };
    });
    return {
      styles: config.styles,
    };
  },
});
