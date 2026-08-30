/**
 * Lightweight modal that renders one trailing recipe section as markdown.
 * Used by recipe view section buttons so extra content opens on demand.
 */
import { MarkdownRenderer } from "obsidian";
import { t } from "../../i18n";
import { App } from "obsidian";
import { Component } from "obsidian";
import { BaseModal } from "./modal-shell";

export class SectionContentModal extends BaseModal {
    constructor(
        app: App,
        private readonly sectionHeading: string,
        private readonly sectionMarkdown: string,
        private readonly sourcePath: string,
        private readonly markdownComponent: Component,
        private readonly onEditSection?: (heading: string) => void,
    ) {
        super(app);
    }

    getTitle(): string {
        return this.sectionHeading;
    }

    getIcon(): string {
        return "file-text";
    }

    async renderBody(bodyEl: HTMLElement): Promise<void> {
        await MarkdownRenderer.render(this.app, this.sectionMarkdown, bodyEl, this.sourcePath, this.markdownComponent);
    }

    renderFooter(footerEl: HTMLElement): void {

        if (this.onEditSection) {
            footerEl.createEl("button", { text: t("modal.sectionContent.title") }).addEventListener("click", () => {
                this.close();
                this.onEditSection?.(this.sectionHeading);
            });
        }
        footerEl.createEl("button", { cls: "mod-cta", text: t("common.close") }).addEventListener("click", () => this.close());
    }
}
