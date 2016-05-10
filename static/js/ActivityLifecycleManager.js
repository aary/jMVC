/*
 *      ActivityLifecycleManager.js
 *
 * This file contains the module that is needed to control the lifecycle of
 * the activities it controls.  It should maintain a list of activity IDs set
 * up by the boot loader.  And one list with siblings that have a path and one
 * list with siblings that do not have a path.  Causing a show event on an
 * Activity with a path should cause an Activity without a path to get swapped
 * out
 */
function ActivityLifecycleManager() {}

ActivityLifecycleManager.prototype.register_activity_id
