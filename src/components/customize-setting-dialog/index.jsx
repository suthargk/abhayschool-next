"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { LANGUAGES } from "@/Helper/languages";

const CustomizeSettingDialog = () => {
  const { theme, setTheme } = useTheme();

  const [customizeSettings, setCustomizeSettings] = useState({
    isCustomizeSettingDialog: true,
    themeMode: theme,
    language: LANGUAGES[0],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const language = localStorage.getItem("language");
      const storedTheme = localStorage.getItem("theme");

      setCustomizeSettings({
        isCustomizeSettingDialog: !(language && (storedTheme || theme)),
        themeMode: storedTheme || theme,
        language:
          LANGUAGES.find((lang) => lang.value === language) || LANGUAGES[0],
      });
    }
  }, [theme]);

  const handleClick = () => {
    localStorage.setItem("language", customizeSettings.language.value);
    localStorage.setItem("theme", customizeSettings.themeMode); // (you missed saving theme before)

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
          <DialogTitle>Customize Your Experience</DialogTitle>
          <DialogDescription>
            Select your preferred language and theme to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mt-2">
            <div className="font-medium">Select Your Language</div>
            <Select
              defaultValue={customizeSettings.language}
              onValueChange={(value) => {
                setCustomizeSettings((settings) => ({
                  ...settings,
                  language: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {LANGUAGES.map((language) => {
                    return (
                      <SelectItem key={language.id} value={language}>
                        {language.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col  gap-2">
            <div className="font-medium">Choose Your Theme</div>
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
                  <div>Dark</div>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="light" aria-label="Toggle light">
                <div className="flex gap-2 items-center">
                  <SunIcon />
                  <div>Light</div>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="Toggle system">
                <div className="flex gap-2 items-center">
                  <DesktopIcon />
                  <div>System</div>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeSettingDialog;
