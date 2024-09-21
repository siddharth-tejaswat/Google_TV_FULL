-- Table: public.Sarthak_MVP

-- DROP TABLE IF EXISTS public."Sarthak_MVP";

CREATE TABLE IF NOT EXISTS public."Sarthak_MVP"
(
    "RECORD_PRIMARY_ID" character varying[] COLLATE pg_catalog."default" NOT NULL,
    "DATE_TIMESTAMP" character varying[] COLLATE pg_catalog."default",
    "BARCODE_READ" character varying[] COLLATE pg_catalog."default",
    "BARCODE_NUMBER" character varying[] COLLATE pg_catalog."default",
    "BARCODE_IMAGE" character varying COLLATE pg_catalog."default",
    "GTV_READ" character varying[] COLLATE pg_catalog."default",
    "GTV_IMAGE" character varying COLLATE pg_catalog."default",
    "IMAGE_FROM_CAMERA" character varying COLLATE pg_catalog."default",
    "PROCESSED_IMAGE" character varying COLLATE pg_catalog."default",
    "OVERALL_STATUS" character varying[] COLLATE pg_catalog."default",
    CONSTRAINT "Sarthak_MVP_pkey" PRIMARY KEY ("RECORD_PRIMARY_ID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Sarthak_MVP"
    OWNER to postgres;