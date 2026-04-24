# Supabase Notes

## Ownership model
- `auth.users.id` maps to `profiles.auth_user_id`.
- Every mutable app table is scoped through `profiles.id`.
- Library recipes are readable by everyone in the app when `owner_profile_id` is `NULL`.
- User-created recipes use `owner_profile_id = current_profile_id()`.

## Storage model
- Food photos live in the `food-photos` bucket.
- Object paths should start with the signed-in auth user id:
  - `<auth-user-id>/meal-photos/<filename>`
- Storage policies assume the first folder segment is the current `auth.uid()`.

## Tables covered by the first migration
- `profiles`
- `recipes`
- `planned_weeks`
- `food_log_entries`
- `water_log_entries`
- `chat_threads`
- `chat_messages`

## Next schema follow-ups
- Add seed scripts for the curated meal library.
- Add RLS-safe server-side writes for AI-generated plans and photo analysis.
- Decide whether grocery items remain JSON on `planned_weeks` or move to a dedicated table.
