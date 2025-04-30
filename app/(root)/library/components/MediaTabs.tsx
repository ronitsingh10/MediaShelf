"use client";

import { useState, useRef, useEffect } from "react";
import { mediaTypes } from "@/lib/constants";
import HoverTabs from "@/components/HoverTabs";
import { TabsContent } from "@radix-ui/react-tabs";

type MediaTabsProps = {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
};

const MediaTabs = ({ selectedTab, setSelectedTab }: MediaTabsProps) => {
  return </HoverTabs tabsContent={mediaTypes} selectedTab={selectedTab} setSelectedTab={setSelectedTab}>

};

export default MediaTabs;
