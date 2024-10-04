# Supabase
## Setting up the new user triggers
```
-- INSERTS USERS INTO ROLE-BASED TABLES DEPENDING ON ACCESS LEVEL, DEFAULTING TO A STUDENT
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin

  if (new.raw_user_meta_data)::jsonb ->> 'access_level' = 'academy' then
    insert into public.academy (role, id, email, first_name, last_name)
    values ('academy', new.id, new.email, (new.raw_user_meta_data)::jsonb ->> 'first_name', (new.raw_user_meta_data)::jsonb ->> 'last_name');
  
  elsif (new.raw_user_meta_data)::jsonb ->> 'access_level' = 'visiting_teacher' then
    insert into public.visiting_teachers (role, id, email, first_name, last_name)
    values ('visiting_teacher', new.id, new.email, (new.raw_user_meta_data)::jsonb ->> 'first_name', (new.raw_user_meta_data)::jsonb ->> 'last_name');
  
  elsif (new.raw_user_meta_data)::jsonb ->> 'access_level' = 'school_teacher' then
    insert into public.school_teachers (role, id, email, first_name, last_name, school_id)
    values ('school_teacher', new.id, new.email, (new.raw_user_meta_data)::jsonb ->> 'first_name', (new.raw_user_meta_data)::jsonb ->> 'last_name', ((new.raw_user_meta_data)::jsonb ->> 'school_id')::int);    
  
  else
    insert into public.students (role, id, email, first_name, last_name, school_id)
    values ('student', new.id, new.email, (new.raw_user_meta_data)::jsonb ->> 'first_name', (new.raw_user_meta_data)::jsonb ->> 'last_name', ((new.raw_user_meta_data)::jsonb ->> 'school_id')::int);
    
    update registers
    set student_ids = array_append(student_ids, new.id)
    where registers.id = ((new.raw_user_meta_data)::jsonb ->> 'register_id')::int;

  end if;

  return new;
end;
$$;

-- TRIGGERS THE ABOVE FUNCTION WHEN A NEW USER IS CREATED
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Functions for checking user roles

```
-- GET A USER'S ROLE FROM THEIR RELEVANT PROFILE TABLE
create or replace function get_role(user_id uuid)
returns text
language sql
as $$
  select * 
  from (
    select role from admin where id = user_id
    union
    select role from academy where id = user_id
    union
    select role from visiting_teachers where id = user_id
    union
    select role from school_teachers where id = user_id
    union
    select role from students where id = user_id
  ) as alias
$$;


-- TEST FOR ADMIN USERS
create or replace function is_admin(user_id uuid) 
returns boolean
language sql
as $$
  select exists (select * FROM admin WHERE admin.id = user_id)
$$;

-- TEST FOR ACADEMY USERS
create or replace function is_academy(user_id uuid) 
returns boolean
language sql
as $$
  select exists (select * FROM academy WHERE academy.id = user_id)
$$;

-- TEST FOR VISITNG TEACHER USERS
create or replace function is_visiting_teacher(user_id uuid) 
returns boolean
language sql
as $$
  select exists (select * FROM visiting_teachers WHERE visiting_teachers.id = user_id)
$$;

-- TEST FOR SCHOOL TEACHER USERS
create or replace function is_school_teacher(user_id uuid) 
returns boolean
language sql
as $$
  select exists (select * FROM school_teachers WHERE school_teachers.id = user_id)
$$;

select exists (select * FROM school_teachers WHERE school_teachers.id = user_id and school_teachers.school_id =)



-- TEST FOR STUDENT USERS
create or replace function is_student(user_id uuid) 
returns boolean
language sql
as $$
  select exists (select * FROM students WHERE students.id = user_id)
$$;
```

-- TEST FOR SCHOOL TEACHER'S REGISTER ACCESS
-- drop function is_school_teacher_at_school(user_id uuid, registers_school_id integer);
-- create or replace function is_school_teacher_at_school(user_id uuid, registers_school_id bigint) 
-- returns boolean
-- language sql
-- as $$
--   select exists (select * FROM school_teachers WHERE school_teachers.id = user_id and school_teachers.school_id = registers_school_id)
-- $$;

## Functions for admin users only
```
-- FETCH ACADEMY USERS
drop function fetch_academy_users();
create or replace function fetch_academy_users()
returns table(id uuid, email text, first_name text, last_name text)
language sql
as $$
  select
    id,
    email,
    first_name,
    last_name
  from academy;
$$;
```

-- create or replace function fetch_school_id_from_student_id(user_id uuid)
-- returns int
-- language sql
-- as $$
--   select school_id
--   from students 
--   where id = user_id;
-- $$;

## Functions for academy users only

```
-- FETCH SCHOOLS AND REGISTERS FOR THE SCHOOL LIST
-- drop function fetch_school_list_for_academy_users()
create or replace function fetch_school_list_for_academy_users()
returns table(register_id int, register_course text, register_title text, school_id int, school_title text)
language sql
as $$
  select
    registers.id,
    registers.course,
    registers.title,
    schools.id,
    schools.title
  from schools
  left join registers on schools.id = registers.school_id;
$$;



-- CREATE A NEW SCHOOL
create or replace function create_school(title text)
returns text
language sql
as $$
  insert into schools (title) values (title) returning title;
$$;

-- FETCH SCHOOL TEACHER USERS
drop function fetch_school_teacher_users();
create or replace function fetch_school_teacher_users()
returns table(id uuid, email text, first_name text, last_name text, school_id int)
language sql
as $$
  select
    id,
    email,
    first_name,
    last_name,
    school_id
  from school_teachers;
$$;

-- CREATE A NEW REGISTER, RETURNING THE TITLE
create or replace function create_register(title text, course text, school_id int)
returns text
language sql
as $$
  insert into registers (title, course, school_id) values (title, course, school_id) returning title;
$$;
```




-- CREATE A NEW EVIDENCE ROW IN THE EVIDENCE TABLE
--drop function create_evidence(uuid, int, text, int, int, varchar[], text, varchar, int, text, boolean);
-- create or replace function create_evidence(student_id uuid, school_id int, course text, lesson_number int, status int, student_dish_images varchar[], student_evaluation text, student_timeplan varchar, teacher_score int, teacher_feedback text, teacher_absent boolean)
-- returns uuid
-- language sql
-- as $$
--   insert into evidence (student_id, school_id, course, lesson_number, status, student_dish_images, student_evaluation, student_timeplan, teacher_score, teacher_feedback, teacher_absent) values (student_id, school_id, course, lesson_number, status, student_dish_images, student_evaluation, student_timeplan, teacher_score, teacher_feedback, teacher_absent) returning id;
-- $$;
select * from create_evidence('8381a48d-149f-4422-9ac2-cc953aa43a77', 4, null, 1, 0, array['',''], null, null, 7, null, true)

## For school teacher users only
```
-- FETCH REGISTERS FOR A SCHOOL TEACHER
drop function get_registers_for_school_teachers(uuid);
create or replace function get_registers_for_school_teachers(user_id uuid)
returns table(title text, course text, id int)
language sql
as $$
  select registers.title, registers.course, registers.id
    FROM registers
    left join school_teachers on registers.school_id = school_teachers.school_id
    WHERE school_teachers.id = user_id
$$;

-- ALTERNATIVE
create or replace function get_registers_for_school_teacher(user_id uuid)
returns setof registers
language sql
as $$
  select * FROM registers WHERE roles.id = auth.uid()
$$;

-- GET A LIST OF STUDENTS FROM A REGISTER
drop function get_students_from_register(int);
create or replace function get_students_from_register(register_id int)
returns table(id uuid, first_name text, last_name text, email text, evidence_old json, menus json, tests json, group_task json, hygiene json, cth json)
language sql
as $$
  select students.id, students.first_name, students.last_name, students.email, students.evidence, students.menus, students.tests, students.group_task, students.hygiene, students.cth
    FROM registers
    left join students on students.id = ANY(registers.student_ids)
    WHERE registers.id = register_id
$$;
```

select

-- GET A SINGLE STUDENT'S DATA
drop function get_student_data(uuid);
create or replace function get_student_data(user_id uuid)
returns table(id uuid, first_name text, last_name text, email text, evidence json, menus json, tests json, group_task json, hygiene json, cth json)
language sql
as $$
  select students.id, students.first_name, students.last_name, students.email, students.evidence, students.menus, students.tests, students.group_task, students.hygiene, students.cth
    FROM students
    WHERE students.id = user_id
$$;
```

## For student users
```
-- GET REGISTER BY STUDENT, USE IT TO GET THE STUDENT'S COURSE
create or replace function get_register_by_student() 
returns text
language sql
as $$
  select course FROM registers WHERE auth.uid() = ANY(registers.student_ids) limit 1;
$$;

-- GET DATA FOR A SINGLE STUDENT
drop function get_student_data();
create or replace function get_student_data() 
returns students
language sql
as $$
  select * FROM students WHERE auth.uid() = students.id limit 1;
$$;
```

## Not currently used
```
-- USE THIS FOR ADDITIONAL POLICIES
-- drop function studentIsInRegister(int);
create or replace function is_in_register(register_id int)
returns boolean
language sql
as $$
  select exists (select * from registers where auth.uid() = ANY(registers.student_ids));
$$;

-- USE THIS FOR ADDITIONAL POLICIES
-- drop function check_for_register_school_id_matching_user_school_id();
create or replace function registers_matching_users_school_id()
  RETURNS BOOLEAN
AS $func$
  SELECT EXISTS (
    select *
    FROM registers
    left join school_teachers on registers.school_id = school_teachers.school_id
    WHERE school_teachers.id = auth.uid()
  );
$func$ LANGUAGE sql;


create or replace function check_for_register_school_id_matching_user_school_id()
returns boolean
language sql
as $$
  select * FROM school_teachers WHERE id = auth.uid()
$$;

```
drop function fetch_user_role();

create or replace function fetch_user_role()
returns text
language sql
as $$
  select role FROM roles WHERE roles.id = auth.uid()
$$;


create or replace function get_register(id int)
returns setof registers
language sql
as $$
  select *
    FROM registers
    WHERE registers.id = id
$$;

create or replace function get_register(id int)
returns setof registers
language sql
as $$
  select *
    FROM registers
    WHERE registers.id = id
$$;

--select * FROM fetch_user_role()


-- create or replace function save_evidence(evidence_data json, user_id uuid) 
-- returns students
-- language sql
-- as $$
--   update students
--   set evidence = evidence_data
--   where id = user_id
--   returning *;
-- $$;


create or replace function save_group_task(group_data json, user_id uuid) 
returns students
language sql
as $$
  update students
  set group_task = group_data
  where id = user_id
  returning *;
$$;

create or replace function save_menus(menus_data json, user_id uuid) 
returns students
language sql
as $$
  update students
  set menus = menus_data
  where id = user_id
  returning *;
$$;
