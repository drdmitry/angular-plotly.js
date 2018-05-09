import { Injectable, Component, EventEmitter, Input, Output, ViewChild, IterableDiffers, KeyValueDiffers, NgModule } from '@angular/core';
import * as Plotlyjs from 'plotly.js/dist/plotly.js';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Plotly;
(function (Plotly) {
    /**
     * @record
     */
    function Figure() { }
    Plotly.Figure = Figure;
    function PlotlyHTMLElement() { }
    Plotly.PlotlyHTMLElement = PlotlyHTMLElement;
    
})(Plotly || (Plotly = {}));
class PlotlyService {
    constructor() {
        this.plotly = Plotlyjs;
        if (typeof this.plotly === 'undefined') {
            throw new Error(`Peer dependency plotly.js isn't installed`);
        }
    }
    /**
     * @param {?} div
     * @param {?} data
     * @param {?=} layout
     * @param {?=} config
     * @return {?}
     */
    newPlot(div, data, layout, config) {
        return this.plotly.newPlot(div, data, layout);
    }
    /**
     * @param {?} div
     * @param {?} data
     * @param {?=} layout
     * @param {?=} config
     * @return {?}
     */
    plot(div, data, layout, config) {
        return this.plotly.plot(div, data, layout);
    }
    /**
     * @param {?} div
     * @param {?} data
     * @param {?=} layout
     * @param {?=} config
     * @return {?}
     */
    update(div, data, layout, config) {
        return this.plotly.update(div, data, layout);
    }
    /**
     * @param {?} div
     * @return {?}
     */
    resize(div) {
        return this.plotly.Plots.resize(div);
    }
}
PlotlyService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PlotlyService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PlotComponent {
    /**
     * @param {?} plotly
     * @param {?} iterableDiffers
     * @param {?} keyValueDiffers
     */
    constructor(plotly, iterableDiffers, keyValueDiffers) {
        this.plotly = plotly;
        this.iterableDiffers = iterableDiffers;
        this.keyValueDiffers = keyValueDiffers;
        this.defaultClassName = 'js-plotly-plot';
        this.revision = 0;
        this.debug = false;
        this.useResizeHandler = false;
        this.initialized = new EventEmitter();
        this.update = new EventEmitter();
        this.purge = new EventEmitter();
        this.error = new EventEmitter();
        this.afterExport = new EventEmitter();
        this.afterPlot = new EventEmitter();
        this.animated = new EventEmitter();
        this.animatingFrame = new EventEmitter();
        this.animationInterrupted = new EventEmitter();
        this.autoSize = new EventEmitter();
        this.beforeExport = new EventEmitter();
        this.buttonClicked = new EventEmitter();
        this.click = new EventEmitter();
        this.clickAnnotation = new EventEmitter();
        this.deselect = new EventEmitter();
        this.doubleClick = new EventEmitter();
        this.framework = new EventEmitter();
        this.hover = new EventEmitter();
        this.legendClick = new EventEmitter();
        this.legendDoubleClick = new EventEmitter();
        this.relayout = new EventEmitter();
        this.restyle = new EventEmitter();
        this.redraw = new EventEmitter();
        this.selected = new EventEmitter();
        this.selecting = new EventEmitter();
        this.sliderChange = new EventEmitter();
        this.sliderEnd = new EventEmitter();
        this.sliderStart = new EventEmitter();
        this.transitioning = new EventEmitter();
        this.transitionInterrupted = new EventEmitter();
        this.unhover = new EventEmitter();
        this.eventNames = ['afterExport', 'afterPlot', 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
            'beforeExport', 'buttonClicked', 'click', 'clickAnnotation', 'deselect', 'doubleClick', 'framework', 'hover',
            'legendClick', 'legendDoubleClick', 'relayout', 'restyle', 'redraw', 'selected', 'selecting', 'sliderChange',
            'sliderEnd', 'sliderStart', 'transitioning', 'transitionInterrupted', 'unhover'];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.createPlot().then(() => {
            const /** @type {?} */ figure = this.createFigure();
            this.initialized.emit(figure);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (typeof this.resizeHandler === 'function') {
            this.getWindow().removeEventListener('resize', /** @type {?} */ (this.resizeHandler));
            this.resizeHandler = undefined;
        }
        const /** @type {?} */ figure = this.createFigure();
        this.purge.emit(figure);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        let /** @type {?} */ shouldUpdate = false;
        const /** @type {?} */ revision = changes["revision"];
        if (revision && !revision.isFirstChange()) {
            shouldUpdate = true;
        }
        const /** @type {?} */ debug = changes["debug"];
        if (debug && !debug.isFirstChange()) {
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            this.updatePlot();
        }
        this.updateWindowResizeHandler();
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        let /** @type {?} */ shouldUpdate = false;
        if (this.layoutDiffer) {
            const /** @type {?} */ layoutHasDiff = this.layoutDiffer.diff(this.layout);
            if (layoutHasDiff) {
                shouldUpdate = true;
            }
        }
        else if (this.layout) {
            this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
        }
        else {
            this.layoutDiffer = undefined;
        }
        if (this.dataDiffer) {
            const /** @type {?} */ dataHasDiff = this.dataDiffer.diff(this.data);
            if (dataHasDiff) {
                shouldUpdate = true;
            }
        }
        else if (Array.isArray(this.data)) {
            this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
        }
        else {
            this.dataDiffer = undefined;
        }
        if (shouldUpdate && this.plotlyInstance) {
            this.updatePlot();
        }
    }
    /**
     * @return {?}
     */
    getWindow() {
        return window;
    }
    /**
     * @return {?}
     */
    getClassName() {
        let /** @type {?} */ classes = [this.defaultClassName];
        if (Array.isArray(this.className)) {
            classes = classes.concat(this.className);
        }
        else if (this.className) {
            classes.push(this.className);
        }
        return classes.join(' ');
    }
    /**
     * @return {?}
     */
    createPlot() {
        return this.plotly.newPlot(this.plotEl.nativeElement, this.data, this.layout, this.config).then(plotlyInstance => {
            this.plotlyInstance = plotlyInstance;
            this.getWindow().gd = this.debug ? plotlyInstance : undefined;
            this.eventNames.forEach(name => {
                const /** @type {?} */ eventName = `plotly_${name.toLowerCase()}`;
                plotlyInstance.on(eventName, (data) => (/** @type {?} */ (this[name])).emit(data));
            });
            this.updateWindowResizeHandler();
        }, err => {
            console.error('Error while plotting:', err);
            this.error.emit(err);
        });
    }
    /**
     * @return {?}
     */
    createFigure() {
        const /** @type {?} */ p = this.plotlyInstance;
        const /** @type {?} */ figure = {
            data: p.data,
            layout: p.layout,
            frames: p._transitionData ? p._transitionData._frames : null
        };
        return figure;
    }
    /**
     * @return {?}
     */
    updatePlot() {
        if (!this.plotlyInstance) {
            const /** @type {?} */ error = new Error(`Plotly component wasn't initialized`);
            this.error.emit(error);
            throw error;
        }
        return this.createPlot().then(() => {
            const /** @type {?} */ figure = this.createFigure();
            this.update.emit(figure);
        });
    }
    /**
     * @return {?}
     */
    updateWindowResizeHandler() {
        if (this.useResizeHandler) {
            if (this.resizeHandler === undefined) {
                this.resizeHandler = () => this.plotly.resize(this.plotlyInstance);
                this.getWindow().addEventListener('resize', /** @type {?} */ (this.resizeHandler));
            }
        }
        else {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', /** @type {?} */ (this.resizeHandler));
                this.resizeHandler = undefined;
            }
        }
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    dataDifferTrackBy(index, item) {
        const /** @type {?} */ obj = Object.assign({}, item, { uid: '' });
        return JSON.stringify(obj);
    }
}
PlotComponent.decorators = [
    { type: Component, args: [{
                selector: 'plotly-plot',
                template: `<div #plot [attr.id]="divId" [className]="getClassName()" [ngStyle]="style"></div>`,
                providers: [PlotlyService],
            },] },
];
/** @nocollapse */
PlotComponent.ctorParameters = () => [
    { type: PlotlyService, },
    { type: IterableDiffers, },
    { type: KeyValueDiffers, },
];
PlotComponent.propDecorators = {
    "plotEl": [{ type: ViewChild, args: ['plot',] },],
    "data": [{ type: Input },],
    "layout": [{ type: Input },],
    "config": [{ type: Input },],
    "style": [{ type: Input },],
    "divId": [{ type: Input },],
    "revision": [{ type: Input },],
    "className": [{ type: Input },],
    "debug": [{ type: Input },],
    "useResizeHandler": [{ type: Input },],
    "initialized": [{ type: Output },],
    "update": [{ type: Output },],
    "purge": [{ type: Output },],
    "error": [{ type: Output },],
    "afterExport": [{ type: Output },],
    "afterPlot": [{ type: Output },],
    "animated": [{ type: Output },],
    "animatingFrame": [{ type: Output },],
    "animationInterrupted": [{ type: Output },],
    "autoSize": [{ type: Output },],
    "beforeExport": [{ type: Output },],
    "buttonClicked": [{ type: Output },],
    "click": [{ type: Output },],
    "clickAnnotation": [{ type: Output },],
    "deselect": [{ type: Output },],
    "doubleClick": [{ type: Output },],
    "framework": [{ type: Output },],
    "hover": [{ type: Output },],
    "legendClick": [{ type: Output },],
    "legendDoubleClick": [{ type: Output },],
    "relayout": [{ type: Output },],
    "restyle": [{ type: Output },],
    "redraw": [{ type: Output },],
    "selected": [{ type: Output },],
    "selecting": [{ type: Output },],
    "sliderChange": [{ type: Output },],
    "sliderEnd": [{ type: Output },],
    "sliderStart": [{ type: Output },],
    "transitioning": [{ type: Output },],
    "transitionInterrupted": [{ type: Output },],
    "unhover": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PlotlyModule {
}
PlotlyModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [PlotComponent],
                exports: [PlotComponent],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { PlotlyModule, PlotComponent, PlotlyService };
//# sourceMappingURL=angular-plotly.js.js.map