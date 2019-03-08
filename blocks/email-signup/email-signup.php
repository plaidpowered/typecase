<?php

namespace Typecase\EmailSignup;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/email-signup', array(
        'editor_script' => WP_DEBUG ? 'typecase-email-signup-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-email-signup-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\EmailSignup\register_block');
