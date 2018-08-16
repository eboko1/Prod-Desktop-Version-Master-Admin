# Responsive

Collection of MediaQueries depend of your needs.

Use it in your components like this:
`<DesktopView>...</DesktopView>`

If you need same logic within multiple breakpoints
you should provide custom prop `view` to `ResponsiveView`

`<ResponsiveView view={ { min: 768, max: 1440 } }>...</ResponsiveView>`

## BREAKPOINTS

---

MOBILE

| Size | Breakpoint |
| ---- | :--------: |
| xs   |   <576px   |
| sm   |   ≥576px   |

---

TABLET

| Size | Breakpoint |
| ---- | :--------: |
| md   |   ≥768px   |
| lg   |   ≥992px   |

---

DESKTOP

| Size | Breakpoint |
| ---- | :--------: |
| xl   |  ≥1200px   |
| xxl  |  ≥1600px   |

---

## Docs references

[Ant Design](https://ant.design/components/grid/)

[Bootstrap 4](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)
