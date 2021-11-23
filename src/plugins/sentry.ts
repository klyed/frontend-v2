import { App } from 'vue';
import { captureException, init, setTag } from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { version } from '../../package.json';

// Using Sentry's vanila JS package (@sentry/browser) here instead of
// the official vue package (@sentry/vue) because it doesn't support vue 3 yet.
// https://github.com/getsentry/sentry-javascript/issues/2925

const ENV = process.env.VUE_APP_ENV || 'development';
const NETWORK = process.env.VUE_APP_NETWORK || '42';
const networkMap = {
  '1': 'mainnet',
  '42': 'kovan',
  '137': 'polygon',
  '34113': 'fuji',
  '34114': 'avalanche'
};
const environment = `${ENV}-${networkMap[NETWORK]}`;
const release = `frontend-v2@${version}`;

export default function initSentry(app: App) {
  if (['production', 'staging'].includes(ENV)) {
    app.config.errorHandler = (error, _, info) => {
      try {
        setTag('info', info);
        captureException(error, {
          extra: {
            error: error
          }
        });
      } catch (error) {
        console.error('Failed to send error to Sentry', error);
      }
    };

    init({
      dsn:
        'https://673994646b794c1e96965200650c81c0@o1068975.ingest.sentry.io/6063287',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
      environment,
      release
    });
  }
}
