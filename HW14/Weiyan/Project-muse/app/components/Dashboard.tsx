"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Filter,
  LinkIcon,
  Loader2,
  PanelRightClose,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { CATEGORY_OPTIONS } from "@/app/lib/types";
import type { LibraryImage } from "@/app/lib/types";
import type { CurrentUser } from "@/app/lib/auth-user";

type FilterOptions = {
  categories: string[];
  garments: string[];
  brands: string[];
  genders: string[];
  styles: string[];
  materials: string[];
  colors: string[];
  patterns: string[];
  occasions: string[];
};

type FilterState = {
  query: string;
  selections: Record<string, string[]>;
  addedFrom: string;
  addedTo: string;
};

const emptyFilters: FilterOptions = {
  categories: [],
  garments: [],
  brands: [],
  genders: [],
  styles: [],
  materials: [],
  colors: [],
  patterns: [],
  occasions: []
};

const filterFields = [
  ["category", "Category", "categories"],
  ["garment", "Garment", "garments"],
  ["brand", "Brand / designer", "brands"],
  ["gender", "Gender", "genders"],
  ["style", "Style", "styles"],
  ["material", "Material", "materials"],
  ["color", "Color", "colors"],
  ["pattern", "Pattern", "patterns"],
  ["occasion", "Occasion", "occasions"]
] as const;

const tagFields = [
  ["garment", "Garment"],
  ["brand", "Brand / designer"],
  ["gender", "Gender"],
  ["style", "Style"],
  ["material", "Material"],
  ["colors", "Colors"],
  ["pattern", "Pattern"],
  ["occasion", "Occasion"]
] as const;

type EditableTags = Record<(typeof tagFields)[number][0] | "category", string[]>;

const MASONRY_CARD_WIDTH = 248;
const MASONRY_GAP = 18;
const MASONRY_STANDARD_MAX_COLUMNS = 4;
const MASONRY_WIDE_MAX_COLUMNS = 5;
const MASONRY_WIDE_BREAKPOINT = 1500;

export function Dashboard({ user }: { user: CurrentUser }) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    selections: {},
    addedFrom: "",
    addedTo: ""
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(emptyFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<"upload" | "url">("upload");
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [masonryColumnCount, setMasonryColumnCount] = useState(MASONRY_STANDARD_MAX_COLUMNS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brandVisible, setBrandVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedImage = useMemo(
    () => images.find((image) => image.id === selectedId) ?? null,
    [images, selectedId]
  );

  useEffect(() => {
    void refresh();
  }, [filters]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = window.setTimeout(() => setError(null), 20_000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    let lastY = window.scrollY;
    setBrandVisible(window.scrollY <= 1);

    function handleScroll() {
      const nextY = window.scrollY;
      setBrandVisible(nextY <= 1);

      if (uploading) {
        setToolbarCollapsed(false);
        lastY = nextY;
        return;
      }

      if (nextY > lastY + 14 && nextY > 80) {
        setToolbarCollapsed(true);
      } else if (nextY < lastY - 10 || nextY < 24) {
        setToolbarCollapsed(false);
      }
      lastY = nextY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [uploading]);

  useEffect(() => {
    if (uploading) {
      setToolbarCollapsed(false);
    }
  }, [uploading]);

  useEffect(() => {
    function updateColumnCount() {
      const maxColumns =
        window.innerWidth >= MASONRY_WIDE_BREAKPOINT
          ? MASONRY_WIDE_MAX_COLUMNS
          : MASONRY_STANDARD_MAX_COLUMNS;
      const availableWidth = Math.max(0, window.innerWidth - 48);
      const nextCount = Math.max(
        1,
        Math.min(
          maxColumns,
          Math.floor((availableWidth + MASONRY_GAP) / (MASONRY_CARD_WIDTH + MASONRY_GAP))
        )
      );

      setMasonryColumnCount(nextCount);
    }

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  async function refresh() {
    const isInitialLoad = images.length === 0 && loading;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setFiltering(true);
    }
    setError(null);
    const params = new URLSearchParams();

    if (filters.query) {
      params.set("query", filters.query);
    }

    if (filters.addedFrom) {
      params.set("addedFrom", filters.addedFrom);
    }

    if (filters.addedTo) {
      params.set("addedTo", filters.addedTo);
    }

    for (const [key, values] of Object.entries(filters.selections)) {
      for (const value of values) {
        params.append(key, value);
      }
    }

    const filterOptionParams = new URLSearchParams();
    for (const category of filters.selections.category ?? []) {
      filterOptionParams.append("category", category);
    }

    try {
      const [imagesResponse, filtersResponse] = await Promise.all([
        fetch(`/api/images?${params.toString()}`),
        fetch(`/api/filters?${filterOptionParams.toString()}`)
      ]);

      if (!imagesResponse.ok) {
        throw new Error("Could not load images.");
      }

      const payload = await imagesResponse.json();
      setImages(payload.images);
      setFilterOptions(await filtersResponse.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Loading failed.");
    } finally {
      setLoading(false);
      window.setTimeout(() => setFiltering(false), 120);
    }
  }

  async function uploadImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setUploading(true);
    setError(null);

    try {
      const form = new FormData(formElement);
      if (sourceMode === "upload") {
        form.delete("photoUrl");
      } else {
        form.delete("image");
      }

      const response = await fetch("/api/images", {
        method: "POST",
        body: form
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      formElement.reset();
      setImages((current) => [
        payload.image,
        ...current.filter((image) => image.id !== payload.image.id)
      ]);
      setSelectedId(payload.image.id);
      setFilterOpen(false);
      setToolbarCollapsed(true);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function updateQuery(value: string) {
    setFilters((current) => ({
      ...current,
      query: value
    }));
  }

  function toggleFilterValue(key: string, value: string) {
    setFilters((current) => {
      const currentValues = current.selections[key] ?? [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        selections: {
          ...current.selections,
          [key]: nextValues
        }
      };
    });
  }

  function updateAddedDateRange(key: "addedFrom" | "addedTo", value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value
    }));
  }

  function clearFilters() {
    setFilters({ query: "", selections: {}, addedFrom: "", addedTo: "" });
  }

  function recordRatio(imageId: string, width: number, height: number) {
    if (!width || !height) {
      return;
    }

    setImageRatios((current) => ({
      ...current,
      [imageId]: width / height
    }));
  }

  const sideMode = selectedImage ? "inspector" : filterOpen ? "filter" : "closed";
  const masonryColumns = useMemo(
    () => distributeMasonryColumns(images, imageRatios, masonryColumnCount),
    [images, imageRatios, masonryColumnCount]
  );

  return (
    <main
      className={`muse-shell ${sideMode === "filter" ? "muse-shell-filter-open" : ""} ${
        sideMode === "inspector" ? "muse-shell-inspector-open" : ""
      }`}
    >
      <div className={`muse-brand ${brandVisible ? "" : "muse-brand-hidden"}`}>
        <div className="muse-logo">MUSE</div>
      </div>

      <button
        className="filter-tab"
        data-testid="filter-tab"
        onClick={() => {
          setSelectedId(null);
          setFilterOpen((current) => !current);
        }}
        type="button"
      >
        <Filter size={16} />
        Filter
      </button>

      <section className="whiteboard-canvas" aria-label="muse whiteboard canvas">
        {selectedImage ? (
          <button
            aria-label="Close inspector"
            className="canvas-focus-backdrop"
            onClick={() => setSelectedId(null)}
            type="button"
          />
        ) : null}
        {selectedImage ? <SelectedImagePreview image={selectedImage} /> : null}
        {loading ? (
          <div className="canvas-message">
            <Loader2 className="animate-spin" size={18} />
            Loading canvas
          </div>
        ) : images.length === 0 ? (
          <div className="canvas-message">Add a photo from the bottom toolbar to start your board.</div>
        ) : (
          <div
            className={`masonry-board ${filtering ? "masonry-board-filtering" : ""}`}
            data-testid="masonry-board"
            style={{
              gridTemplateColumns: `repeat(${masonryColumnCount}, minmax(0, ${MASONRY_CARD_WIDTH}px))`
            }}
          >
            {masonryColumns.map((column, columnIndex) => (
              <div className="masonry-column" key={`masonry-column-${columnIndex}`}>
                {column.map((image) => (
                  <ImageCard
                    image={image}
                    isSelected={selectedImage?.id === image.id}
                    key={image.id}
                    ratio={imageRatios[image.id]}
                    onImageLoad={recordRatio}
                    onSelect={() => {
                      setSelectedId(image.id);
                      setFilterOpen(false);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <SidePanel
        filterOptions={filterOptions}
        filters={filters}
        image={selectedImage}
        imageCount={images.length}
        mode={sideMode}
        onClearFilters={clearFilters}
        onClose={() => {
          setSelectedId(null);
          setFilterOpen(false);
        }}
        onDeleteSelected={async () => {
          setSelectedId(null);
          await refresh();
        }}
        onToggleFilterValue={toggleFilterValue}
        onUpdateDateRange={updateAddedDateRange}
        onUpdateQuery={updateQuery}
        onUpdated={refresh}
      />

      <BottomToolbar
        collapsed={uploading ? false : toolbarCollapsed}
        error={error}
        hidden={sideMode === "inspector"}
        onClearError={() => setError(null)}
        onExpand={() => setToolbarCollapsed(false)}
        onSourceModeChange={setSourceMode}
        onSubmit={uploadImage}
        sourceMode={sourceMode}
        uploading={uploading}
        user={user}
      />
    </main>
  );
}

function SelectedImagePreview({ image }: { image: LibraryImage }) {
  return (
    <figure className="selected-preview" data-testid="selected-preview">
      <img alt={image.title || image.description} src={image.imageUrl} />
    </figure>
  );
}

function ImageCard({
  image,
  isSelected,
  onImageLoad,
  onSelect,
  ratio
}: {
  image: LibraryImage;
  isSelected: boolean;
  onImageLoad: (imageId: string, width: number, height: number) => void;
  onSelect: () => void;
  ratio?: number;
}) {
  const displayRatio = ratio ? Math.min(1.5, Math.max(0.5, ratio)) : 1;
  const tags = previewTagsFromImage(image);

  return (
    <button
      className={`muse-card ${isSelected ? "muse-card-selected" : ""}`}
      data-testid="muse-card"
      onClick={onSelect}
      type="button"
    >
      <div className="muse-card-image" style={{ aspectRatio: displayRatio }}>
        <img
          alt={image.title || image.description}
          src={image.imageUrl}
          onLoad={(event) =>
            onImageLoad(
              image.id,
              event.currentTarget.naturalWidth,
              event.currentTarget.naturalHeight
            )
          }
        />
      </div>
      <div className="muse-card-body">
        <div className="truncate text-sm font-medium">
          {image.title || firstTag(image.garmentType) || "Untitled"}
        </div>
        <div className="tag-preview">
          {tags.map((tag, index) => (
            <span className="tag-pill" key={`${tag}-${index}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function distributeMasonryColumns(
  images: LibraryImage[],
  ratios: Record<string, number>,
  columnCount: number
) {
  const columns = Array.from({ length: Math.max(1, columnCount) }, () => ({
    height: 0,
    items: [] as LibraryImage[]
  }));

  for (const image of images) {
    const targetColumn = columns.reduce((shortest, column, index) =>
      column.height < columns[shortest].height ? index : shortest
    , 0);

    columns[targetColumn].items.push(image);
    columns[targetColumn].height += estimatedCardHeight(image, ratios[image.id]);
  }

  return columns.map((column) => column.items);
}

function estimatedCardHeight(image: LibraryImage, ratio?: number) {
  const displayRatio = ratio ? Math.min(1.5, Math.max(0.5, ratio)) : 1;
  const imageHeight = MASONRY_CARD_WIDTH / displayRatio;
  const tags = previewTagsFromImage(image).length;
  const tagRows = tags > 4 ? 2 : tags > 0 ? 1 : 0;
  return imageHeight + 42 + tagRows * 22 + MASONRY_GAP;
}

function SidePanel({
  filterOptions,
  filters,
  image,
  imageCount,
  mode,
  onClearFilters,
  onClose,
  onDeleteSelected,
  onToggleFilterValue,
  onUpdateDateRange,
  onUpdateQuery,
  onUpdated
}: {
  filterOptions: FilterOptions;
  filters: FilterState;
  image: LibraryImage | null;
  imageCount: number;
  mode: "closed" | "filter" | "inspector";
  onClearFilters: () => void;
  onClose: () => void;
  onDeleteSelected: () => Promise<void>;
  onToggleFilterValue: (key: string, value: string) => void;
  onUpdateDateRange: (key: "addedFrom" | "addedTo", value: string) => void;
  onUpdateQuery: (value: string) => void;
  onUpdated: () => Promise<void>;
}) {
  return (
    <aside className={`side-panel side-panel-${mode} ${mode !== "closed" ? "side-panel-open" : ""}`}>
      <div className="side-panel-header">
        <div>
          <div className="text-sm font-medium">{mode === "filter" ? "Filters" : "Inspector"}</div>
          <div className="text-xs text-neutral-500">
            {mode === "filter" ? `${imageCount} images on canvas selected` : "Tune the selected image"}
          </div>
        </div>
        <button className="icon-button" onClick={onClose} type="button" aria-label="Close panel">
          <PanelRightClose size={16} />
        </button>
      </div>

      {mode === "filter" ? (
        <FilterPanel
          filterOptions={filterOptions}
          filters={filters}
          onClearFilters={onClearFilters}
          onToggleFilterValue={onToggleFilterValue}
          onUpdateDateRange={onUpdateDateRange}
          onUpdateQuery={onUpdateQuery}
        />
      ) : image ? (
        <DetailPanel image={image} onDeleted={onDeleteSelected} onSaved={onClose} onUpdated={onUpdated} />
      ) : null}
    </aside>
  );
}

function FilterPanel({
  filterOptions,
  filters,
  onClearFilters,
  onToggleFilterValue,
  onUpdateDateRange,
  onUpdateQuery
}: {
  filterOptions: FilterOptions;
  filters: FilterState;
  onClearFilters: () => void;
  onToggleFilterValue: (key: string, value: string) => void;
  onUpdateDateRange: (key: "addedFrom" | "addedTo", value: string) => void;
  onUpdateQuery: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="side-panel-content filter-panel-content">
      <div className="input-row filter-search-row">
        <Search size={15} />
        <input
          className="bare-input"
          value={filters.query}
          onChange={(event) => onUpdateQuery(event.target.value)}
          placeholder="boho linen coral"
        />
      </div>
      <div className="filter-groups">
        {filterFields.map(([key, label, optionsKey]) => (
          <FilterGroup
            expanded={Boolean(expanded[key])}
            key={key}
            label={label}
            options={filterOptions[optionsKey]}
            selected={filters.selections[key] ?? []}
            testId={`filter-${key}`}
            onToggleExpanded={() =>
              setExpanded((current) => ({
                ...current,
                [key]: !current[key]
              }))
            }
            onToggleValue={(value) => onToggleFilterValue(key, value)}
          />
        ))}
        <FilterDateGroup
          expanded={Boolean(expanded.addedDate)}
          from={filters.addedFrom}
          to={filters.addedTo}
          onToggleExpanded={() =>
            setExpanded((current) => ({
              ...current,
              addedDate: !current.addedDate
            }))
          }
          onUpdate={onUpdateDateRange}
        />
      </div>
      <button className="filter-clear-button" onClick={onClearFilters} type="button">
        Clear filters
      </button>
    </div>
  );
}

function FilterGroup({
  expanded,
  label,
  onToggleExpanded,
  onToggleValue,
  options,
  selected,
  testId
}: {
  expanded: boolean;
  label: string;
  onToggleExpanded: () => void;
  onToggleValue: (value: string) => void;
  options: string[];
  selected: string[];
  testId: string;
}) {
  return (
    <section className={`filter-group ${expanded ? "filter-group-open" : ""}`} data-testid={testId}>
      <button className="filter-group-toggle" onClick={onToggleExpanded} type="button">
        <span>
          {label}
          {selected.length > 0 ? <span className="filter-count">{selected.length}</span> : null}
        </span>
        <span className="filter-toggle-mark">{expanded ? "-" : "+"}</span>
      </button>
      <div className="filter-options" aria-hidden={!expanded}>
        {options.length === 0 ? (
          <div className="filter-empty">No values yet</div>
        ) : (
          options.map((option) => (
            <label className="filter-option" key={option}>
              <input
                checked={selected.includes(option)}
                onChange={() => onToggleValue(option)}
                type="checkbox"
                value={option}
              />
              <span>{option}</span>
            </label>
          ))
        )}
      </div>
    </section>
  );
}

function FilterDateGroup({
  expanded,
  from,
  onToggleExpanded,
  onUpdate,
  to
}: {
  expanded: boolean;
  from: string;
  onToggleExpanded: () => void;
  onUpdate: (key: "addedFrom" | "addedTo", value: string) => void;
  to: string;
}) {
  const activeCount = Number(Boolean(from)) + Number(Boolean(to));

  return (
    <section className={`filter-group ${expanded ? "filter-group-open" : ""}`} data-testid="filter-added-date">
      <button className="filter-group-toggle" onClick={onToggleExpanded} type="button">
        <span>
          Added date
          {activeCount > 0 ? <span className="filter-count">{activeCount}</span> : null}
        </span>
        <span className="filter-toggle-mark">{expanded ? "-" : "+"}</span>
      </button>
      <div className="filter-options filter-date-options" aria-hidden={!expanded}>
        <label>
          <span>Begin month</span>
          <input
            type="month"
            value={from}
            max={to || undefined}
            onChange={(event) => onUpdate("addedFrom", event.target.value)}
          />
        </label>
        <label>
          <span>End month</span>
          <input
            type="month"
            value={to}
            min={from || undefined}
            onChange={(event) => onUpdate("addedTo", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}

function BottomToolbar({
  collapsed,
  error,
  hidden,
  onClearError,
  onExpand,
  onSourceModeChange,
  onSubmit,
  sourceMode,
  uploading,
  user
}: {
  collapsed: boolean;
  error: string | null;
  hidden: boolean;
  onClearError: () => void;
  onExpand: () => void;
  onSourceModeChange: (mode: "upload" | "url") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  sourceMode: "upload" | "url";
  uploading: boolean;
  user: CurrentUser;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  function chooseUpload() {
    onSourceModeChange("upload");
    fileInputRef.current?.click();
  }

  function chooseUrl() {
    onSourceModeChange("url");
    window.setTimeout(() => urlInputRef.current?.focus(), 0);
  }

  return (
    <>
      <div className={`toolbar-veil ${hidden ? "toolbar-veil-hidden" : ""}`} aria-hidden="true" />
    <div
      className={`bottom-toolbar ${collapsed ? "bottom-toolbar-collapsed" : ""} ${
        hidden ? "bottom-toolbar-hidden" : ""
      }`}
      data-testid="bottom-toolbar"
    >
      {error ? <div className="toolbar-error-pill">{error}</div> : null}
      <button className="toolbar-pill" onClick={onExpand} type="button">
        <Plus size={16} />
        Add inspiration
      </button>
      <form
        className="toolbar-form"
        onReset={() => {
          setSelectedFileName("");
          setUrlValue("");
        }}
        onSubmit={onSubmit}
      >
        <div className="toolbar-account">
          <button
            className="toolbar-account-button"
            title={user.email || user.name || "Signed in"}
            type="button"
            aria-label="Account"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((current) => !current)}
          >
            {initialsForUser(user)}
          </button>
          {accountOpen ? (
            <div className="toolbar-account-menu">
              <div className="toolbar-account-email">{user.email || user.name || "Signed in"}</div>
              <button type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
                Log out
              </button>
            </div>
          ) : null}
        </div>

        <div className="segmented-control">
          <button
            className={sourceMode === "upload" ? "segment-active" : ""}
            type="button"
            onClick={chooseUpload}
            aria-label="Upload photo"
            title="Upload"
          >
            <Upload size={14} />
            <span className="segment-label">Upload</span>
          </button>
          <button
            className={sourceMode === "url" ? "segment-active" : ""}
            type="button"
            onClick={chooseUrl}
            aria-label="Use photo URL"
            title="URL"
          >
            <LinkIcon size={14} />
            <span className="segment-label">URL</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          className="sr-only"
          data-testid="photo-input"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          aria-label="Photo"
          onChange={(event) => setSelectedFileName(event.currentTarget.files?.[0]?.name ?? "")}
        />

        {sourceMode === "url" ? (
          <div className="toolbar-url-field">
            <input
              ref={urlInputRef}
              className="toolbar-input toolbar-source-input"
              name="photoUrl"
              placeholder="https://example.com/photo.jpg"
              type="url"
              required
              aria-label="Photo URL"
              value={urlValue}
              onChange={(event) => {
                setUrlValue(event.target.value);
                onClearError();
              }}
            />
            {urlValue ? (
              <button
                className="toolbar-url-clear"
                type="button"
                aria-label="Clear photo URL"
                onClick={() => {
                  setUrlValue("");
                  onClearError();
                  urlInputRef.current?.focus();
                }}
              >
                ×
              </button>
            ) : null}
          </div>
        ) : selectedFileName ? (
          <div className="toolbar-file-name" title={selectedFileName}>
            {selectedFileName}
          </div>
        ) : null}

        <input
          className="toolbar-input toolbar-title"
          name="title"
          placeholder="coral resort set, poolside"
          aria-label="Title or description"
        />

        <button
          className="button-primary whitespace-nowrap"
          disabled={uploading || (sourceMode === "upload" && !selectedFileName)}
          type="submit"
        >
          {uploading ? <Loader2 className="animate-spin" size={15} /> : <Plus size={15} />}
          {uploading ? "musing" : "Add"}
        </button>
      </form>
    </div>
    </>
  );
}

function DetailPanel({
  image,
  onDeleted,
  onSaved,
  onUpdated
}: {
  image: LibraryImage;
  onDeleted: () => Promise<void>;
  onSaved: () => void;
  onUpdated: () => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [metadataSaving, setMetadataSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [mainNote, setMainNote] = useState("");
  const [tags, setTags] = useState<EditableTags>(emptyEditableTags());

  useEffect(() => {
    setNotes("");
    setTitle(image.title ?? "");
    setMainNote(image.description);
    setTags(tagsFromImage(image));
  }, [image.id]);

  async function saveMetadata() {
    setMetadataSaving(true);
    await fetch(`/api/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: mainNote, tags })
    });
    setMetadataSaving(false);
    await onUpdated();
    onSaved();
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await fetch(`/api/images/${image.id}/annotations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        designerName: image.designerName,
        notes
      })
    });
    setNotes("");
    setSaving(false);
    await onUpdated();
  }

  async function deleteImage() {
    const confirmed = window.confirm(
      `Delete "${image.title || firstTag(image.garmentType) || "this image"}" from muse? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    const response = await fetch(`/api/images/${image.id}`, {
      method: "DELETE"
    });
    setDeleting(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Delete failed." }));
      window.alert(payload.error || "Delete failed.");
      return;
    }

    await onDeleted();
  }

  return (
    <div className="side-panel-content">
      <div>
        <label className="block text-xs font-medium text-neutral-700">
          Title
          <input
            className="input mt-1"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="AI title or your edit"
          />
        </label>
        <label className="mt-4 block text-xs font-medium text-neutral-700">
          Note
          <textarea
            className="input mt-1 min-h-24"
            value={mainNote}
            onChange={(event) => setMainNote(event.target.value)}
            placeholder="Designer note from AI or your edit"
          />
        </label>
        {image.annotations.length > 0 ? (
          <div className="mt-3 space-y-2">
            {image.annotations.map((annotation) => (
              <article className="rounded-md border border-neutral-200 p-3" key={annotation.id}>
                <div className="mb-1 text-xs font-medium text-neutral-500">{annotation.authorName}</div>
                <p className="text-sm">{annotation.notes}</p>
              </article>
            ))}
          </div>
        ) : null}
        <form className="mt-3 flex gap-2" onSubmit={addNote}>
          <input
            className="input"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add another note"
            required
          />
          <button className="button-secondary whitespace-nowrap" disabled={saving} type="submit">
            {saving ? "Saving" : "Add note"}
          </button>
        </form>
      </div>

      <section className="space-y-3 border-t border-neutral-200 pt-4">
        <CategoryField
          value={tags.category[0] || "Ready-to-wear"}
          onChange={(value) =>
            setTags((current) => ({
              ...current,
              category: [value]
            }))
          }
        />
        {tagFields.map(([key, label]) => (
          <TagField
            key={key}
            label={label}
            values={tags[key]}
            onAdd={(value) =>
              setTags((current) => ({
                ...current,
                [key]: addTag(current[key], value)
              }))
            }
            onRemove={(value) =>
              setTags((current) => ({
                ...current,
                [key]: current[key].filter((tag) => tag !== value)
              }))
            }
          />
        ))}
        <button className="button-primary w-full" onClick={saveMetadata} disabled={metadataSaving} type="button">
          {metadataSaving ? "Saving" : "Save"}
        </button>
      </section>

      <section className="border-t border-neutral-200 pt-4">
        <button className="button-secondary w-full" disabled={deleting} onClick={deleteImage} type="button">
          <Trash2 size={15} />
          {deleting ? "Deleting" : "Delete image"}
        </button>
      </section>
    </div>
  );
}

function TagField({
  label,
  values,
  onAdd,
  onRemove
}: {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  function commitDraft() {
    onAdd(draft);
    setDraft("");
    setEditing(false);
  }

  return (
    <div>
      <div className="mb-1 text-xs font-medium text-neutral-700">{label}</div>
      <div className="flex flex-wrap gap-1">
        {values.map((value) => (
          <button className="tag-pill tag-pill-button" key={value} type="button" onClick={() => onRemove(value)}>
            {value}
            <X size={12} />
          </button>
        ))}
        {editing ? (
          <input
            ref={inputRef}
            className="tag-add-input"
            value={draft}
            onBlur={commitDraft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitDraft();
              }
              if (event.key === "Escape") {
                setDraft("");
                setEditing(false);
              }
            }}
            aria-label={`Add ${label.toLowerCase()}`}
          />
        ) : (
          <button className="tag-pill tag-pill-button" type="button" onClick={() => setEditing(true)}>
            +Add
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryField({
  onChange,
  value
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block text-xs font-medium text-neutral-700">
      Category
      <select
        className="select mt-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function tagsFromImage(image: LibraryImage): EditableTags {
  return {
    category: splitTags(image.category),
    garment: splitTags(image.garmentType),
    brand: splitTags(image.brand),
    gender: splitTags(image.gender),
    style: splitTags(image.style),
    material: splitTags(image.material),
    colors: splitTags(image.colorPalette),
    pattern: splitTags(image.pattern),
    occasion: splitTags(image.occasion)
  };
}

function previewTagsFromImage(image: LibraryImage) {
  return [
    firstTag(image.garmentType),
    firstTag(image.brand),
    firstTag(image.gender),
    firstTag(image.style),
    firstTag(image.material),
    firstTag(image.colorPalette),
    firstTag(image.pattern),
    firstTag(image.occasion)
  ].filter(Boolean);
}

function emptyEditableTags(): EditableTags {
  return {
    category: ["Ready-to-wear"],
    garment: [],
    brand: [],
    gender: [],
    style: [],
    material: [],
    colors: [],
    pattern: [],
    occasion: []
  };
}

function splitTags(value: string) {
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function addTag(values: string[], value: string) {
  const clean = value.trim();
  if (!clean) {
    return values;
  }

  return Array.from(new Set([...values, clean])).slice(0, 5);
}

function firstTag(value: string) {
  return splitTags(value)[0];
}

function initialsForUser(user: CurrentUser) {
  const label = user.name || user.email || "muse";
  const emailLocalPart = user.email?.split("@")[0] ?? "";
  const parts = (user.name || emailLocalPart || label)
    .split(/[\s._-]+/)
    .filter(Boolean);
  const initials =
    parts.length > 1
      ? parts
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
      : (parts[0] || label).slice(0, 2);

  return initials.toUpperCase() || "MU";
}
