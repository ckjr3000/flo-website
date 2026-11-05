import { d as derived, b as attr, l as element, e as escape_html, a as ensure_array_like } from "./index.js";
import { spanToPlainText, isPortableTextToolkitList, isPortableTextListItemBlock, isPortableTextToolkitSpan, isPortableTextBlock, isPortableTextToolkitTextNode, buildMarksTree, nestLists, LIST_NEST_MODE_HTML } from "@portabletext/toolkit";
import "clsx";
import { a4 as fallback } from "./utils2.js";
function getRandomKey() {
  return Math.random().toFixed(5).split(".")[1];
}
function assertSpanKey(span) {
  return {
    _key: span._key || getRandomKey(),
    ...span
  };
}
function assertBlockKey(block) {
  return {
    _key: block._key || getRandomKey(),
    ...block,
    ...block._type === "block" && Array.isArray(block.children) ? {
      children: block.children.map(assertSpanKey)
    } : {}
  };
}
function DefaultMark($$renderer, $$props) {
  let { portableText, children } = $$props;
  let markType = derived(() => portableText.markType);
  if (markType() === "strong") {
    $$renderer.push(`<!--[0--><strong>`);
    children?.($$renderer);
    $$renderer.push(`<!----></strong>`);
  } else if (markType() === "em") {
    $$renderer.push(`<!--[1--><em>`);
    children?.($$renderer);
    $$renderer.push(`<!----></em>`);
  } else if (markType() === "code") {
    $$renderer.push(`<!--[2--><code>`);
    children?.($$renderer);
    $$renderer.push(`<!----></code>`);
  } else if (markType() === "underline") {
    $$renderer.push(`<!--[3--><span style="text-decoration:underline;">`);
    children?.($$renderer);
    $$renderer.push(`<!----></span>`);
  } else if (markType() === "strike-through") {
    $$renderer.push(`<!--[4--><del>`);
    children?.($$renderer);
    $$renderer.push(`<!----></del>`);
  } else {
    $$renderer.push("<!--[-1-->");
    children?.($$renderer);
    $$renderer.push(`<!---->`);
  }
  $$renderer.push(`<!--]-->`);
}
function DefaultLink($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { portableText, children } = $$props;
    let href = derived(() => {
      const { href: href2, url, link, value } = portableText.value;
      return href2 || url || link || value;
    });
    if (typeof href() === "string") {
      $$renderer2.push(`<!--[0--><a${attr("href", href())}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DefaultBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { portableText, children } = $$props;
    let style = derived(() => portableText.value.style || "normal");
    if (["h1", "h2", "h3", "h4", "h5", "h6", "blockquote"].includes(style())) {
      $$renderer2.push("<!--[0-->");
      element($$renderer2, style(), void 0, () => {
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      });
    } else if (style() === "normal") {
      $$renderer2.push(`<!--[1--><p>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DefaultList($$renderer, $$props) {
  let { portableText, children } = $$props;
  let value = derived(() => portableText.value);
  let listItem = derived(() => value().listItem);
  if (listItem() === "number") {
    $$renderer.push(`<!--[0--><ol>`);
    children?.($$renderer);
    $$renderer.push(`<!----></ol>`);
  } else {
    $$renderer.push(`<!--[-1--><ul>`);
    children?.($$renderer);
    $$renderer.push(`<!----></ul>`);
  }
  $$renderer.push(`<!--]-->`);
}
function DefaultListItem($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<li>`);
  children?.($$renderer);
  $$renderer.push(`<!----></li>`);
}
function DefaultHardBreak($$renderer) {
  $$renderer.push(`<br/>`);
}
function UnknownType($$renderer, $$props) {
  let { children } = $$props;
  children?.($$renderer);
  $$renderer.push(`<!---->`);
}
const defaultComponents = {
  marks: {
    "strike-through": DefaultMark,
    code: DefaultMark,
    em: DefaultMark,
    strong: DefaultMark,
    underline: DefaultMark,
    link: DefaultLink
  },
  block: {
    blockquote: DefaultBlock,
    h1: DefaultBlock,
    h2: DefaultBlock,
    h3: DefaultBlock,
    h4: DefaultBlock,
    h5: DefaultBlock,
    h6: DefaultBlock,
    normal: DefaultBlock
  },
  list: {
    bullet: DefaultList,
    number: DefaultList
  },
  listItem: {
    bullet: DefaultListItem,
    number: DefaultListItem
  },
  types: {},
  hardBreak: DefaultHardBreak,
  unknownBlockStyle: DefaultBlock,
  unknownList: DefaultList,
  unknownListItem: DefaultListItem,
  unknownMark: DefaultMark,
  unknownType: UnknownType
};
function mergeComponents(parent, overrides = {}) {
  return {
    ...parent,
    ...overrides,
    block: mergeDeeply(parent, overrides, "block"),
    list: mergeDeeply(parent, overrides, "list"),
    listItem: mergeDeeply(parent, overrides, "listItem"),
    marks: mergeDeeply(parent, overrides, "marks"),
    types: mergeDeeply(parent, overrides, "types")
  };
}
function mergeDeeply(parent, overrides, key) {
  const override = overrides[key];
  const parentVal = parent[key];
  if (typeof override === "function") {
    return override;
  }
  if (override && typeof parentVal === "function") {
    return override;
  }
  if (override) {
    return { ...parentVal, ...override };
  }
  return parentVal;
}
function RenderBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, node, indexInParent, children } = $$props;
    let components = derived(() => global.components);
    let style = derived(() => fallback(node.style, "normal"));
    let blockComponent = derived(() => typeof components().block === "function" ? components().block : components().block[style()]);
    let blockProps = derived(() => {
      return { global, indexInParent, value: node };
    });
    let BlockComponent = derived(() => blockComponent() || components().unknownBlockStyle);
    if (BlockComponent()) {
      $$renderer2.push("<!--[-->");
      BlockComponent()($$renderer2, {
        portableText: blockProps(),
        children: ($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
function RenderCustomBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, node, parentBlock, indexInParent, isInline = false } = $$props;
    let components = derived(() => global.components);
    let _type = derived(() => node._type);
    let customComponent = derived(() => components().types[_type()]);
    let componentProps = derived(() => /* @__PURE__ */ (() => {
      return { global, value: node, indexInParent, parentBlock, isInline };
    })());
    let CustomComponent = derived(() => customComponent() || components().unknownType);
    if (CustomComponent()) {
      $$renderer2.push("<!--[-->");
      CustomComponent()($$renderer2, { portableText: componentProps() });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
function RenderList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, indexInParent, node, children } = $$props;
    let listComponent = derived(() => {
      const { list } = global.components;
      return typeof list === "function" ? list : list[node.listItem];
    });
    let listProps = derived(() => ({ global, value: node, indexInParent }));
    let ListComponent = derived(() => listComponent() || global.components.unknownList);
    if (ListComponent()) {
      $$renderer2.push("<!--[-->");
      ListComponent()($$renderer2, {
        portableText: listProps(),
        children: ($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
function RenderListItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, indexInParent, node, children } = $$props;
    let components = derived(() => global.components);
    let style = derived(() => node.style ?? "normal");
    let listItemComponent = derived(() => typeof components().listItem === "function" ? components().listItem : components().listItem[style()]);
    let StyleComponent = derived(() => style() !== "normal" ? components().block[style()] : void 0);
    let listItemProps = derived(() => ({ global, value: node, indexInParent }));
    let ListItemComponent = derived(() => listItemComponent() || components().unknownListItem);
    if (ListItemComponent()) {
      $$renderer2.push("<!--[-->");
      ListItemComponent()($$renderer2, {
        portableText: listItemProps(),
        children: ($$renderer3) => {
          if (StyleComponent()) {
            $$renderer3.push("<!--[0-->");
            if (StyleComponent()) {
              $$renderer3.push("<!--[-->");
              StyleComponent()($$renderer3, {
                portableText: { ...listItemProps(), value: { ...node, listItem: void 0 } },
                children: ($$renderer4) => {
                  children?.($$renderer4);
                  $$renderer4.push(`<!---->`);
                },
                $$slots: { default: true }
              });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
          } else {
            $$renderer3.push("<!--[-1-->");
            children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
function RenderSpan($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, node, parentBlock, children } = $$props;
    let markComponent = derived(() => global.components.marks[node.markType]);
    let markProps = derived(() => ({
      global,
      parentBlock,
      markType: node.markType,
      // @ts-expect-error @TODO
      value: node.markDef,
      markKey: node.markKey,
      plainTextContent: spanToPlainText(node)
    }));
    let MarkComponent = derived(() => markComponent() || global.components.unknownMark);
    if (MarkComponent()) {
      $$renderer2.push("<!--[-->");
      MarkComponent()($$renderer2, {
        portableText: markProps(),
        children: ($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
function RenderText($$renderer, $$props) {
  let { global, node } = $$props;
  let components = derived(() => global.components);
  let text = derived(() => node.text);
  if (text() === "\n") {
    $$renderer.push("<!--[0-->");
    if (typeof components().hardBreak === "function") {
      $$renderer.push("<!--[0-->");
      if (components().hardBreak) {
        $$renderer.push("<!--[-->");
        components().hardBreak($$renderer, {});
        $$renderer.push("<!--]-->");
      } else {
        $$renderer.push("<!--[!-->");
        $$renderer.push("<!--]-->");
      }
    } else {
      $$renderer.push(`<!--[-1-->${escape_html(text())}`);
    }
    $$renderer.push(`<!--]-->`);
  } else {
    $$renderer.push(`<!--[-1-->${escape_html(text())}`);
  }
  $$renderer.push(`<!--]-->`);
}
function RenderNode_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { global, options } = $$props;
    let node = derived(() => options.node), indexInParent = derived(() => options.indexInParent), parentBlock = derived(() => options.parentBlock), isInline = derived(() => options.isInline);
    if (isPortableTextToolkitList(node())) {
      $$renderer2.push("<!--[0-->");
      RenderList($$renderer2, {
        node: node(),
        indexInParent: indexInParent(),
        global,
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(node().children);
          for (let childIndex = 0, $$length = each_array.length; childIndex < $$length; childIndex++) {
            let child = each_array[childIndex];
            RenderNode_1($$renderer3, {
              options: {
                node: child,
                indexInParent: childIndex,
                parentBlock: void 0,
                isInline: void 0
              },
              global
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else if (isPortableTextListItemBlock(node())) {
      $$renderer2.push("<!--[1-->");
      RenderListItem($$renderer2, {
        node: node(),
        indexInParent: indexInParent(),
        global,
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(buildMarksTree(node()));
          for (let childIndex = 0, $$length = each_array_1.length; childIndex < $$length; childIndex++) {
            let child = each_array_1[childIndex];
            RenderNode_1($$renderer3, {
              options: {
                parentBlock: node(),
                node: child,
                isInline: true,
                indexInParent: childIndex
              },
              global
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else if (isPortableTextToolkitSpan(node())) {
      $$renderer2.push("<!--[2-->");
      RenderSpan($$renderer2, {
        node: node(),
        parentBlock: parentBlock(),
        global,
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_2 = ensure_array_like(node().children);
          for (let childIndex = 0, $$length = each_array_2.length; childIndex < $$length; childIndex++) {
            let child = each_array_2[childIndex];
            RenderNode_1($$renderer3, {
              options: {
                parentBlock: parentBlock(),
                node: child,
                isInline: true,
                indexInParent: childIndex
              },
              global
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else if (isPortableTextBlock(node())) {
      $$renderer2.push("<!--[3-->");
      RenderBlock($$renderer2, {
        node: node(),
        indexInParent: indexInParent(),
        global,
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_3 = ensure_array_like(buildMarksTree(node()));
          for (let childIndex = 0, $$length = each_array_3.length; childIndex < $$length; childIndex++) {
            let child = each_array_3[childIndex];
            RenderNode_1($$renderer3, {
              options: {
                parentBlock: node(),
                node: child,
                isInline: true,
                indexInParent: childIndex
              },
              global
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else if (isPortableTextToolkitTextNode(node())) {
      $$renderer2.push("<!--[4-->");
      RenderText($$renderer2, { node: node(), global });
    } else if (node()) {
      $$renderer2.push("<!--[5-->");
      RenderCustomBlock($$renderer2, {
        node: node(),
        parentBlock: parentBlock(),
        indexInParent: indexInParent(),
        isInline: isInline(),
        global
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const getTemplate = (type, prop) => `Unknown ${type}, specify a component for it in the \`components${prop ? "." : ""}${prop}\` prop`;
const getWarningMessage = (type, nodeType) => {
  switch (nodeType) {
    case "block":
      return getTemplate(`block type "${type}"`, "types");
    case "blockStyle":
      return getTemplate(`block style "${type}"`, "block");
    case "listItemStyle":
      return getTemplate(`list item style "${type}"`, "listItem");
    case "listStyle":
      return getTemplate(`list style "${type}"`, "list");
    case "mark":
      return getTemplate(`mark type "${type}"`, "marks");
    default:
      return getTemplate("type");
  }
};
function printWarning(message) {
  console.warn(message);
}
function PortableText($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = [],
      components,
      context = {},
      onMissingComponent = true
    } = $$props;
    let mergedComponents = derived(() => mergeComponents(defaultComponents, components));
    let keyedBlocks = derived(() => (Array.isArray(value) ? value : [value]).map(assertBlockKey));
    let blocks = derived(() => nestLists(keyedBlocks(), LIST_NEST_MODE_HTML));
    let missingComponentHandler = derived(() => (type, nodeType) => {
      if (onMissingComponent === false) {
        return;
      }
      const message = getWarningMessage(type, nodeType);
      if (typeof onMissingComponent === "function") {
        onMissingComponent(message, { type, nodeType });
        return;
      }
      printWarning(message);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(blocks());
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let node = each_array[index];
      RenderNode_1($$renderer2, {
        global: {
          components: mergedComponents(),
          missingComponentHandler: missingComponentHandler(),
          context,
          ptBlocks: blocks(),
          ptRawValue: value
        },
        options: { node, isInline: false, indexInParent: index }
      });
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  PortableText as P
};
