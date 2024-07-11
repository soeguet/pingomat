//go:build linux
// +build linux

package main

import (
	"os/exec"
)

func SendPing(internalIP string) *exec.Cmd {
	cmd := exec.Command("ping", "-c", "1", "-W", "0.25", internalIP)
	return cmd
}

func SendCurl(internalIP, internalPort string) *exec.Cmd {
	cmd := exec.Command("curl", internalIP+":"+internalPort)
	return cmd
}

func configureCmd(cmd *exec.Cmd) {
	// no-op
}

// FlashWindow not implemented
func FlashWindow(_ string) bool {
	return true
}
