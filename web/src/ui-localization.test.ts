import { afterEach, describe, expect, it } from "vitest";
import { localizeUi, translateUiText } from "./ui-localization";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("UI localization", () => {
  it("translates exact labels in both directions", () => {
    expect(translateUiText("Overview", "zh-CN")).toBe("概览");
    expect(translateUiText("概览", "en")).toBe("Overview");
    expect(translateUiText("  Create agent\n", "zh-CN")).toBe("  创建 Agent\n");
  });

  it("translates supported dynamic UI labels", () => {
    expect(translateUiText("3 agents", "zh-CN")).toBe("3 个 Agent");
    expect(translateUiText("2 ready or unavailable", "zh-CN")).toBe("2 个就绪或不可用");
    expect(translateUiText("1 active Agents · 12m execution · 34 tokens · 5 Turns", "zh-CN")).toBe(
      "1 个活跃 Agent · 执行 12 分钟 · 34 Tokens · 5 Turns",
    );
    expect(translateUiText("Send a task to research…", "zh-CN")).toBe("向 research 发送任务…");
    expect(translateUiText("向 research 发送任务…", "en")).toBe("Send a task to research…");
  });

  it("localizes labels and attributes while preserving authored content", () => {
    document.body.innerHTML = `
      <main>
        <h1>External</h1>
        <button title="Create agent" aria-label="Create agent">New agent</button>
        <input placeholder="The enduring subject this Agent will maintain" />
        <div data-i18n-preserve><p>Overview</p></div>
        <pre>Result</pre>
      </main>
    `;

    localizeUi(document.body, "zh-CN");

    expect(document.querySelector("h1")?.textContent).toBe("外部连接");
    const button = document.querySelector("button");
    expect(button?.textContent).toBe("新建 Agent");
    expect(button?.title).toBe("创建 Agent");
    expect(button?.getAttribute("aria-label")).toBe("创建 Agent");
    expect(document.querySelector("input")?.placeholder).toBe("这个 Agent 将长期负责的领域");
    expect(document.querySelector("[data-i18n-preserve]")?.textContent).toBe("Overview");
    expect(document.querySelector("pre")?.textContent).toBe("Result");
  });
});
