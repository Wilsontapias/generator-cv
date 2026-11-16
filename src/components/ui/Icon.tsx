import React from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faArrowDown,
  faArrowLeft,
  faArrowUp,
  faCamera,
  faChevronDown,
  faCompress,
  faExpand,
  faEye,
  faFileLines,
  faFilePdf,
  faFloppyDisk,
  faGripVertical,
  faLock,
  faPalette,
  faPenToSquare,
  faPlus,
  faPrint,
  faRightFromBracket,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  editor: faPenToSquare,
  templates: faPalette,
  preview: faEye,
  pdf: faFilePdf,
  privacy: faLock,
  save: faFloppyDisk,
  file: faFileLines,
  camera: faCamera,
  grip: faGripVertical,
  up: faArrowUp,
  down: faArrowDown,
  close: faXmark,
  back: faArrowLeft,
  plus: faPlus,
  trash: faTrashCan,
  print: faPrint,
  chevronDown: faChevronDown,
  logout: faRightFromBracket,
  maximize: faExpand,
  minimize: faCompress,
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const [width, height, , , pathData] = iconMap[name].icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];

  return (
    <svg
      className={className ? `fa-icon ${className}` : "fa-icon"}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
