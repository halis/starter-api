create table crop (
  id serial primary key,
  name text
);

create table market (
  id serial primary key,
  name text
);

create table owner (
  id serial primary key,
  name text
);

create table product (
  id serial primary key,
  name text,
  ownerId integer references owner(id)
);

create table target (
  id serial primary key,
  categoryCode text,
  cropId integer references crop(id),
  name text
);

create table trial (
  id serial primary key,
  endYear smallint,
  marketId integer references market(id),
  numberWithinProduct integer,
  productId integer references product(id),
  startYear smallint
);

create table agenda_product (
  year smallint,
  month smallint,
  breederNotes text,
  etcNotes text,
  productId integer references product(id),
  productStatus text,
  seedNotes text,
  tdNotes text,
  primary key (year, month)
);

create table agenda_target (
  year smallint,
  month smallint,
  targetId integer references target(id),
  primary key (year, month)
);

create table breeding_milestone (
  trialId integer references trial(id),
  attribute text,
  flagged boolean,
  goal text,
  listOrder integer,
  term text
);

create table category (
  code text primary key,
  name text
);

create table observation_type (
  code text primary key,
  name text,
  type text,
  unit text
);

create table observation (
  trialId integer references trial(id),
  observationTypeCode text references observation_type(code),
  timestamp timestamp,
  value integer
);

-- a join table
create table product_target (
  productId integer references product(id)
);

create table target_goal (
  targetId integer references target(id),
  goal text
);

create table trial_observation (
  trialId integer references trial(id),
  observationTypeCode text references observation_type(code),
  weight real
);
