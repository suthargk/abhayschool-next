"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { LanguageSelect } from "@/components/language-select";

const CustomizeSettingDialog = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");

  const [customizeSettings, setCustomizeSettings] = useState({
    isCustomizeSettingDialog: false,
    themeMode: theme,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");

      setCustomizeSettings({
        isCustomizeSettingDialog: !(storedTheme || theme),
        themeMode: storedTheme || theme,
      });
    }
  }, [theme]);

  const handleClick = () => {
    localStorage.setItem("theme", customizeSettings.themeMode);
    setTheme(customizeSettings.themeMode);

    setCustomizeSettings((settings) => ({
      ...settings,
      isCustomizeSettingDialog: false,
    }));
  };

  return (
    <Dialog
      open={customizeSettings.isCustomizeSettingDialog}
      onOpenChange={(value) => {
        setCustomizeSettings((settings) => ({
          ...settings,
          isCustomizeSettingDialog: value,
        }));
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("customizeDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("customizeDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mt-2">
            <div className="font-medium">{t("customizeDialog.languageLabel")}</div>
            <LanguageSelect triggerClassName="w-full" />
          </div>

          <div className="flex flex-col  gap-2">
            <div className="font-medium">{t("customizeDialog.themeLabel")}</div>
            <ToggleGroup
              type="single"
              className="justify-start"
              defaultValue={customizeSettings.themeMode}
              onValueChange={(value) => {
                setCustomizeSettings((settings) => ({
                  ...settings,
                  themeMode: value,
                }));
              }}
            >
              <ToggleGroupItem value="dark" aria-label="Toggle dark">
                <div className="flex gap-2 items-center">
                  <MoonIcon />
                  <div>{t("theme.dark")}</div>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="light" aria-label="Toggle light">
                <div className="flex gap-2 items-center">
                  <SunIcon />
                  <div>{t("theme.light")}</div>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="Toggle system">
                <div className="flex gap-2 items-center">
                  <DesktopIcon />
                  <div>{t("theme.system")}</div>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            {t("customizeDialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeSettingDialog;
