export type Category = "seguranca" | "prevencao" | "conscientizacao";
export type ArticleStatus = "published" | "draft" | "unpublished";

export interface ArticleSource {
  url: string;
  title: string;
  site: string;
}

export interface PodcastSegment {
  speaker: "ivo" | "flora";
  text: string;
}

export interface Settings {
  ai_model: string;
  publish_time: string; // "06:00"
  podcast_time: string; // "07:00"
  articles_per_day: number;
  category_proportions: {
    seguranca: number;
    prevencao: number;
    conscientizacao: number;
  };
}
