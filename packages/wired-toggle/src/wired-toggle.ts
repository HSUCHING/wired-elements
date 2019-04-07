import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'wired-lib/lib/wired-base';
import { rectangle, ellipse, hachureEllipseFill, svgNode } from 'wired-lib';

@customElement('wired-toggle')
export class WiredToggle extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private knob?: SVGElement;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.4 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
    }

    :host(:focus) path {
      stroke-width: 1.2;
    }

    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }

    .knob {
      transition: transform 0.3s ease;
    }
    .knob path {
      stroke-width: 0.7;
    }
    .knob.checked {
      transform: translateX(48px);
    }
    .knobfill path {
      stroke-width: 3 !important;
      fill: transparent;
    }
    .knob.unchecked .knobFill path {
      stroke: var(--wired-toggle-off-color, gray);
    }
    .knob.checked .knobFill path {
      stroke: var(--wired-toggle-on-color, rgb(63, 81, 181));
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div @click="${this.toggleCheck}">
      <svg id="svg"></svg>
    </div>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  private toggleCheck() {
    this.checked = !(this.checked || false);
    this.fireEvent('change', { checked: this.checked });
  }

  firstUpdated() {
    this.setAttribute('role', 'switch');
    this.addEventListener('keydown', (event) => {
      if ((event.keyCode === 13) || (event.keyCode === 32)) {
        event.preventDefault();
        this.toggleCheck();
      }
    });

    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = { width: 80, height: 34 };
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 16, 8, s.width - 32, 18);

    this.knob = svgNode('g');
    this.knob.classList.add('knob');
    svg.appendChild(this.knob);

    const knobFill = hachureEllipseFill(16, 16, 32, 32);
    knobFill.classList.add('knobfill');
    this.knob.appendChild(knobFill);
    ellipse(this.knob, 16, 16, 32, 32);

    this.classList.remove('wired-pending');
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }

    if (this.knob) {
      const cl = this.knob.classList;
      if (this.checked) {
        cl.remove('unchecked');
        cl.add('checked');
      } else {
        cl.remove('checked');
        cl.add('unchecked');
      }
    }
    this.setAttribute('aria-checked', `${this.checked}`);


    // rectangle(svg, 0, 0, s.width, s.height);
    // const knob = ellipse(svg, s.height / 2, s.height / 2, s.height, s.height);
    // const knobOffset = s.width - s.height;
    // knob.style.transition = 'all 0.3s ease';
    // knob.style.transform = this.checked ? ('translateX(' + knobOffset + 'px)') : '';
    // const cl = knob.classList;
    // if (this.checked) {
    //   cl.remove('unchecked');
    //   cl.add('checked');
    // } else {
    //   cl.remove('checked');
    //   cl.add('unchecked');
    // }

  }
}