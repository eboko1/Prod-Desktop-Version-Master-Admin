const handleHover = (ev, hoveredOrder, dashboard) => {
    ev.preventDefault();
    const DASHBOAD_WIDTH = dashboard.current.offsetWidth;
    const DASHBOARD_HEIGHT = dashboard.current.offsetHeight;

    const TOOLTIP_WIDTH = 200;
    const TOOLTIP_HEIGHT = 170;
    const TOOLTIP_MARGIN = 40;

    const ORDER_WIDTH = hoveredOrder.width;

    const dashboardPosition = dashboard.current.getBoundingClientRect();

    let relativePos = {};
    relativePos.top = hoveredOrder.top - dashboardPosition.top;
    relativePos.left = hoveredOrder.left - dashboardPosition.left;

    let tooltipPositionY = 10;

    let tooltipPositionX = ORDER_WIDTH - TOOLTIP_MARGIN;

    const isTooltipOverflowsX =
        DASHBOAD_WIDTH - relativePos.left - TOOLTIP_MARGIN - TOOLTIP_MARGIN <
        TOOLTIP_WIDTH;

    const isTooltipOverflowsY =
        DASHBOARD_HEIGHT - relativePos.top - TOOLTIP_MARGIN < TOOLTIP_HEIGHT;

    if (isTooltipOverflowsX) {
        tooltipPositionX = -Math.abs(ORDER_WIDTH + TOOLTIP_WIDTH);
    }

    if (isTooltipOverflowsY) {
        tooltipPositionY = -TOOLTIP_HEIGHT / 2;
    }

    return {
        left: tooltipPositionX,
        top:  tooltipPositionY,
    };
};

export default handleHover;
