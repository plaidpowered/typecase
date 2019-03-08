<?php

namespace Typecase\PageIndex;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function register_block()
{
    register_block_type('typecase/page-index', [
        'editor_script' => WP_DEBUG ? 'typecase-page-index-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-page-index-editor' : 'typecase-editor',
        'render_callback' => 'Typecase\PageIndex\render_block'
    ]);
}
add_action('init', 'Typecase\PageIndex\register_block');

function render_block($attributes)
{

    $pages = get_pages([
        'parent' => $attributes['pageSelected'] ?? 0,
        'per_page' => -1,
        'nopaging' => true
    ]);

    if (count($pages) === 0)
        return '';

    $classes = 'wp-block-typecase-page-index';
    if (!empty($attributes['className']))
        $classes .= ' ' . $attributes['className'];

    $tag = apply_filters('Typecase/PageIndex/tag', 'ul', $attributes);

    $return = sprintf('<%s class="%s">', $tag, $classes);

    foreach($pages as $page)
    {
                
        $return .= apply_filters('Typecase/PageIndex/list_item',
            '<li data-page-name="' . $page->post_name . '" class="page-object-' . $page->ID . '">'
            . '<a href="' . esc_url(get_permalink($page)) . '">' . $page->post_title . '</a>'
            . '<blockquote><h5>' 
            . '<a href="' . esc_url(get_permalink($page)) . '">'
            . $page->post_title . '</a></h5>' . get_the_excerpt($page)
            . '<a class="btn btn-primary" href="' . esc_url(get_permalink($page)) . '">Learn More</a>'
            . '</blockquote></li>',
            $page,
            $attributes
        );
        
    }
    wp_reset_postdata();

    $return .= sprintf('</%s>', $tag);

    return $return;

}
