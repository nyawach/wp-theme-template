<?php

/* ======================================== *
 * requires
 * ======================================== */

foreach(glob(TEMPLATEPATH."/functions/*.php") as $file) {
  require_once $file;
}


/* ======================================== *
 * config
 * ======================================== */

// activate post-thumbnail
add_theme_support('post-thumbnails');

// disable admin-bar
// add_filter( 'show_admin_bar', '__return_false' );


/* ======================================== *
 * utils
 * ======================================== */

/*
 * @return article thumbnail url or null
 */
function get_the_thumbnail_url($size = 'thumbnail') {
    if (is_front_page()) {
        return NULL;
    }
    $image_id = get_post_thumbnail_id();
    $image_props = wp_get_attachment_image_src($image_id, $size);
    if (count($image_props) > 0) {
        return $image_props[0];
    } else {
        return NULL;
    }
}
