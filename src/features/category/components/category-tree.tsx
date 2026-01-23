import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Subcategory = {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
};

type Category = {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  mainCategory?: {
    _id?: string;
    name?: string;
    slug?: string;
    image_url?: string | null;
  };
  subcategories?: Subcategory[];
};

const ImageThumb = ({
  src,
  alt,
  size = 36,
}: {
  src?: string | null;
  alt?: string;
  size?: number;
}) => {
  if (!src) {
    return <div className="rounded-md border bg-muted/40" style={{ width: size, height: size }} />;
  }

  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={size}
      height={size}
      className="rounded-md border object-cover"
      style={{ width: size, height: size }}
    />
  );
};

export function CategoryTree({ categories }: { categories: Category[] }) {
  const groups = categories.reduce<Record<string, { main: Category["mainCategory"]; items: Category[] }>>(
    (acc, category) => {
      const main = category.mainCategory;
      const key = main?._id || main?.name || "unassigned";
      if (!acc[key]) {
        acc[key] = { main, items: [] };
      }
      acc[key].items.push(category);
      return acc;
    },
    {}
  );

  const grouped = Object.values(groups).sort((a, b) => {
    const nameA = a.main?.name || "Unassigned";
    const nameB = b.main?.name || "Unassigned";
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="space-y-5">
      {grouped.map((group, index) => {
        const mainName = group.main?.name || "Unassigned";
        const mainSlug = group.main?.slug || "";
        const totalSubcategories = group.items.reduce(
          (sum, item) => sum + (item.subcategories?.length || 0),
          0
        );
        return (
          <Card key={`${mainName}-${index}`} className="border border-border/70">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <ImageThumb src={group.main?.image_url} alt={mainName} size={48} />
                <div>
                  <CardTitle className="text-lg">{mainName}</CardTitle>
                  {mainSlug ? (
                    <div className="text-xs text-muted-foreground">{mainSlug}</div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="w-fit">
                  {group.items.length} categories
                </Badge>
                <Badge variant="outline" className="w-fit">
                  {totalSubcategories} subcategories
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((category) => {
                  const subs = category.subcategories || [];
                  const subcategoryCount = subs.length;
                  return (
                    <Dialog key={category.id || category._id || category.name}>
                      <DialogTrigger asChild>
                        <button
                          className="rounded-lg border border-border/70 bg-background p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                          type="button"
                        >
                          <div className="flex items-start gap-3">
                            <ImageThumb src={category.image_url} alt={category.name} size={40} />
                            <div className="min-w-0">
                              <div className="font-semibold">{category.name}</div>
                              {category.slug ? (
                                <div className="text-xs text-muted-foreground">{category.slug}</div>
                              ) : null}
                            </div>
                          </div>
                          {category.description ? (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="secondary">{subcategoryCount} subcategories</Badge>
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{category.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{subcategoryCount} subcategories</Badge>
                            <Badge variant="outline">{group.items.length} categories in {mainName}</Badge>
                          </div>
                          {subs.length ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {subs.map((sub) => (
                                <div
                                  key={sub.id || sub._id || sub.name}
                                  className="rounded-md border border-border/70 bg-muted/10 px-3 py-2 text-sm"
                                >
                                  <div className="font-medium">{sub.name}</div>
                                  {sub.slug ? (
                                    <div className="text-xs text-muted-foreground">{sub.slug}</div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No subcategories</div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
