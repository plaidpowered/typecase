<?php
/**
 * Plugin Name: Page Index Loop
 * Plugin URI:
 * Description: Generates a collection of links to pages based on the page structure of its parent
 * Author:
 * Author URI:
 * Version: 1.0.0
 * License: GPL3+
 *
 * @package CGB
 */

namespace Typecase\PostBlock;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function register_block()
{
    register_block_type('typecase/single-post', [
        'editor_script' => WP_DEBUG ? 'typecase-single-post-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-single-post-editor' : 'typecase-editor',
        'render_callback' => 'Typecase\PostBlock\render_block'
    ]);
}
add_action('init', 'Typecase\PostBlock\register_block');

function render_block($attributes)
{
    if (empty($attributes['postId']) || is_admin()) {
        return '';
    }
    global $post;

    $old = $post;

    $new = get_post($attributes['postId']);
    if (empty($new))
        return '';

    $post = $new;
    
    setup_postdata($post);

    ob_start();

    get_template_part(apply_filters('Typecase/PostBlock/template_path', 'components/post/block'), get_post_format());
    
    $block_inside = ob_get_clean();

    wp_reset_postdata();

    $post = $old;

    $tag = apply_filters('Typecase/PostBlock/tag', 'article', $attributes);

    $class = implode(" ", get_post_class('wp-block-typecase-single-post single-post', $new->ID));    
    if (!empty($attributes['align'])) {
        $class .= ' align' . $attributes['align'];
    }
	
	if (isset( $attributes['className'])) {
		$class .= ' ' . $attributes['className'];
    }

    if (isset($attributes['layout'])) {
		$class .= ' layout-' . $attributes['layout'];
    }    
    
    $block_content = sprintf(
		'<%2$s class="%1$s">%3$s</%2$s>',
        esc_attr( $class ),
        $tag,
		$block_inside
    );

    return $block_content;

}