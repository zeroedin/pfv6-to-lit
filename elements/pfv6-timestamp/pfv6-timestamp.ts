import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import styles from './pfv6-timestamp.css';

/**
 * A timestamp component displays formatted dates and times with support for various locales and formats.
 *
 * The component supports multiple date and time formats, localization, UTC display, and optional tooltips for additional context. Custom content can be provided via the default slot to override the formatted output.
 *
 * @alias Timestamp
 * @summary Displays formatted dates and times with optional tooltips
 * @slot - Custom content to display instead of the formatted date/time
 * @cssprop --pf-v6-c-timestamp--FontSize - Font size of timestamp text
 * @cssprop --pf-v6-c-timestamp--Color - Color of timestamp text
 * @cssprop --pf-v6-c-timestamp--OutlineOffset - Outline offset for focus state
 * @cssprop --pf-v6-c-timestamp--m-help-text--TextDecorationLine - Text decoration line for help text variant
 * @cssprop --pf-v6-c-timestamp--m-help-text--TextDecorationStyle - Text decoration style for help text variant
 * @cssprop --pf-v6-c-timestamp--m-help-text--TextUnderlineOffset - Text underline offset for help text variant
 * @cssprop --pf-v6-c-timestamp--m-help-text--Color - Text color for help text variant
 * @cssprop --pf-v6-c-timestamp--m-help-text--hover--Color - Text color for help text variant on hover
 * @cssprop --pf-v6-c-timestamp--m-help-text--hover--TextDecorationLine - Text decoration line for help text variant on hover
 * @cssprop --pf-v6-c-timestamp--m-help-text--hover--TextDecorationStyle - Text decoration style for help text variant on hover
 */
@customElement('pfv6-timestamp')
export class Pfv6Timestamp extends LitElement {
  static styles = styles;

  /** The date to display. Defaults to current date if not provided or invalid. */
  @property({ type: Object })
  date?: Date | undefined;

  /**
   * Determines the format of the displayed date.
   * - "full" => Tuesday, August 9, 2022
   * - "long" => August 9, 2022
   * - "medium" => Aug 9, 2022
   * - "short" => 8/9/22
   */
  @property({ type: String, attribute: 'date-format' })
  dateFormat?: 'full' | 'long' | 'medium' | 'short' | undefined;

  /**
   * Determines the format of the displayed time.
   * - "full" => 11:25:00 AM Eastern Daylight Time
   * - "long" => 11:25:00 AM EDT
   * - "medium" => 11:25:00 AM
   * - "short" => 11:25 AM
   */
  @property({ type: String, attribute: 'time-format' })
  timeFormat?: 'full' | 'long' | 'medium' | 'short' | undefined;

  /**
   * Determines the locale for date/time formatting.
   * Defaults to the browser's current locale.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
   */
  @property({ type: String })
  locale?: string | undefined;

  /** Display time in 12-hour format. If not specified, uses locale's default. */
  @property({ type: Boolean, reflect: true, attribute: 'is-12-hour' })
  is12Hour?: boolean | undefined;

  /** Display date/time as UTC instead of local time. */
  @property({ type: Boolean, reflect: true, attribute: 'should-display-utc' })
  shouldDisplayUtc = false;

  /** Custom suffix to append to the displayed date/time (e.g., custom timezone). */
  @property({ type: String, attribute: 'display-suffix' })
  displaySuffix = '';

  /** Value for the time element's datetime attribute. Defaults to ISO string of date. */
  @property({ type: String, attribute: 'date-time' })
  dateTime?: string | undefined;

  /**
   * Custom formatting options for Intl.DateTimeFormat.
   * When provided, overrides dateFormat and timeFormat properties.
   */
  @property({ type: Object, attribute: 'custom-format' })
  customFormat?: Intl.DateTimeFormatOptions | undefined;

  /** Whether to display a tooltip. */
  @property({ type: Boolean, reflect: true, attribute: 'has-tooltip' })
  hasTooltip = false;

  /**
   * Tooltip variant.
   * - "default" => Shows UTC formatted date/time
   * - "custom" => Shows custom content from tooltip-content property
   */
  @property({ type: String, attribute: 'tooltip-variant' })
  tooltipVariant: 'default' | 'custom' = 'default';

  /** Custom suffix for the default UTC tooltip. */
  @property({ type: String, attribute: 'tooltip-suffix' })
  tooltipSuffix = '';

  /** Custom content for tooltip when using tooltip-variant="custom". */
  @property({ type: String, attribute: 'tooltip-content' })
  tooltipContent = '';

  @state()
  private _internalDate: Date = new Date();

  override connectedCallback() {
    super.connectedCallback();
    this.#updateInternalDate();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('date')) {
      this.#updateInternalDate();
    }
  }

  #isValidDate(date?: Date): boolean {
    return Boolean(date && !Number.isNaN(date.getTime()));
  }

  #updateInternalDate() {
    if (this.date && this.#isValidDate(this.date)) {
      const newDate = new Date(this.date);
      if (newDate.toString() !== this._internalDate.toString()) {
        this._internalDate = newDate;
      }
    } else if (!this.date) {
      this._internalDate = new Date();
    }
  }

  #getFormatOptions(): Intl.DateTimeFormatOptions {
    // If customFormat exists, use it instead of dateFormat/timeFormat
    if (this.customFormat) {
      return { ...this.customFormat };
    }

    const options: Intl.DateTimeFormatOptions = {};

    if (this.dateFormat) {
      options.dateStyle = this.dateFormat;
    }

    if (this.timeFormat) {
      options.timeStyle = this.timeFormat;
    }

    if (this.is12Hour !== undefined) {
      options.hour12 = this.is12Hour;
    }

    return options;
  }

  #getDisplayString(): string {
    const formatOptions = this.#getFormatOptions();

    if (this.shouldDisplayUtc) {
      return this.#createUtcContent(this.displaySuffix);
    }

    const dateAsLocaleString = this._internalDate.toLocaleString(this.locale, formatOptions);
    return `${dateAsLocaleString}${this.displaySuffix ? ` ${this.displaySuffix}` : ''}`;
  }

  #convertToUtcString(date: Date): string {
    return new Date(date).toUTCString().slice(0, -3);
  }

  #createUtcContent(customSuffix: string): string {
    const formatOptions = this.#getFormatOptions();
    const utcTimeFormat = this.timeFormat !== 'short' ? 'medium' : 'short';

    const utcDate = new Date(this.#convertToUtcString(this._internalDate));
    const utcDateString = utcDate.toLocaleString(this.locale, {
      ...formatOptions,
      ...(this.timeFormat && { timeStyle: utcTimeFormat }),
    });

    const defaultUtcSuffix = this.timeFormat === 'full' ? 'Coordinated Universal Time' : 'UTC';
    return `${utcDateString} ${customSuffix ? customSuffix : defaultUtcSuffix}`;
  }

  #getTooltipContent(): string {
    if (this.tooltipVariant === 'custom') {
      return this.tooltipContent;
    }
    return this.#createUtcContent(this.tooltipSuffix);
  }

  render() {
    const classes = {
      'help-text': this.hasTooltip,
    };

    const displayContent = this.#getDisplayString();
    const isoDateTime = this.dateTime || this._internalDate.toISOString();

    const timestampTemplate = html`
      <span id="container" class=${classMap(classes)} tabindex=${ifDefined(this.hasTooltip ? 0 : undefined)}>
        <time class="text" datetime=${isoDateTime}>
          <slot>${displayContent}</slot>
        </time>
      </span>
    `;

    return this.hasTooltip ? html`
      <pfv6-tooltip content=${this.#getTooltipContent()}>
        ${timestampTemplate}
      </pfv6-tooltip>
    ` : timestampTemplate;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-timestamp': Pfv6Timestamp;
  }
}
