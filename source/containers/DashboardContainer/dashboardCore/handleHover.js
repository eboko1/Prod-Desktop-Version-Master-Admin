const handleHover = (ev, dashboard, hoveredOrder) => {
    ev.preventDefault();
    const DASHBOAD_OFFSET_TOP = dashboard.offsetTop;
    const DASHBOAD_OFFSET_LEFT = dashboard.offsetLeft;
    const DASHBOAD_WIDTH = dashboard.offsetWidth;
    const DASHBOARD_HEIGHT = dashboard.offsetHeight;
    const DASHBOAD_MARGIN = 20;

    const TOOLTIP_WIDTH = 160;
    const TOOLTIP_HEIGHT = 170;
    const TOOLTIP_MARGIN = 10;

    const ORDER_WIDTH = ev.target.offsetWidth;

    let parentPos = dashboard.getBoundingClientRect();
    let childrenPos = ev.target.getBoundingClientRect();
    let relativePos = {};
    relativePos.top = childrenPos.top - parentPos.top;
    // relativePos.right = childrenPos.right - parentPos.right,
    // relativePos.bottom = childrenPos.bottom - parentPos.bottom,
    relativePos.left = childrenPos.left - parentPos.left;

    let popupPositionY = relativePos.top - TOOLTIP_MARGIN * 5;
    let popupPositionX = relativePos.left + ORDER_WIDTH - TOOLTIP_MARGIN * 2;

    const isTooltipOverflowsX = DASHBOAD_WIDTH - popupPositionX < TOOLTIP_WIDTH;
    const isTooltipOverflowsY =
        DASHBOARD_HEIGHT - popupPositionY < TOOLTIP_HEIGHT;

    if (isTooltipOverflowsX) {
        popupPositionX =
            relativePos.left - (TOOLTIP_WIDTH + TOOLTIP_MARGIN * 7);
    }

    if (isTooltipOverflowsY) {
        popupPositionY = relativePos.top - (TOOLTIP_HEIGHT + TOOLTIP_MARGIN);
    }

    return {
        hovered:     hoveredOrder,
        popupStyles: { left: popupPositionX, top: popupPositionY },
    };
};

export default handleHover;
